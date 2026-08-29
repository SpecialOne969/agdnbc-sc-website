import { Injectable, ForbiddenException, ConflictException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ExamsService {
  constructor(private prisma: PrismaService) {}

  async getStudentExams(studentId: string) {
    const now = new Date();
    const exams = await this.prisma.exam.findMany({
      where: { status: { in: ['scheduled', 'active', 'completed'] } },
      include: { course: true },
      orderBy: { startTime: 'asc' },
    });

    const sessions = await this.prisma.examSession.findMany({ where: { studentId } });
    const sessionMap = new Map(sessions.map((s) => [s.examId, s]));

    return exams.map((exam) => {
      const session = sessionMap.get(exam.id) as { submittedAt: Date | null; score: number | null } | undefined;
      let status = 'upcoming';
      if (session?.submittedAt) status = 'completed';
      else if (now >= exam.startTime && now <= exam.endTime) status = 'active';
      else if (now > exam.endTime) status = 'missed';
      return { ...exam, status, score: session?.score ?? null };
    });
  }

  async getExamForStudent(examId: string, studentId: string) {
    const exam = await this.prisma.exam.findUnique({
      where: { id: examId },
      include: { questions: { orderBy: { order: 'asc' } } },
    });
    if (!exam) throw new NotFoundException('Exam not found');

    const now = new Date();
    if (now < exam.startTime || now > exam.endTime) {
      throw new ForbiddenException('This exam is not currently active');
    }

    const existingSession = await this.prisma.examSession.findUnique({
      where: { studentId_examId: { studentId, examId } },
    });
    if (existingSession?.submittedAt) {
      throw new ConflictException('You have already submitted this exam');
    }

    if (!existingSession) {
      await this.prisma.examSession.create({ data: { studentId, examId, status: 'in_progress' } });
    }

    return {
      id: exam.id,
      title: exam.title,
      duration: exam.duration,
      startTime: exam.startTime,
      endTime: exam.endTime,
      questions: exam.questions.map((q) => ({
        id: q.id,
        text: q.text,
        type: q.type,
        options: q.options,
        marks: q.marks,
      })),
    };
  }

  async submitExam(examId: string, studentId: string, answers: Record<string, string>) {
    const session = await this.prisma.examSession.findUnique({
      where: { studentId_examId: { studentId, examId } },
    });
    if (!session) throw new NotFoundException('Exam session not found');
    if (session.submittedAt) throw new ConflictException('Exam already submitted');

    const questions = await this.prisma.question.findMany({ where: { examId } });

    let totalScore = 0;
    let totalMarks = 0;

    const answerData = questions.map((q) => {
      const answer = answers[q.id] || '';
      const isCorrect = q.type === 'mcq' ? answer === q.correctAnswer : null;
      if (isCorrect) totalScore += q.marks;
      if (q.type === 'mcq') totalMarks += q.marks;
      return { sessionId: session.id, questionId: q.id, answer, isCorrect };
    });

    await this.prisma.examAnswer.createMany({ data: answerData });

    const percentageScore = totalMarks > 0 ? (totalScore / totalMarks) * 100 : null;

    const updated = await this.prisma.examSession.update({
      where: { id: session.id },
      data: { submittedAt: new Date(), score: percentageScore, status: 'submitted' },
    });

    return { score: percentageScore, session: updated };
  }

  async createExam(data: {
    title: string;
    courseId?: string;
    startTime: Date;
    endTime: Date;
    duration: number;
    questions?: Array<{ text: string; type: string; options?: string[]; correctAnswer?: string; marks?: number }>;
  }) {
    const { questions, ...examData } = data;
    const exam = await this.prisma.exam.create({
      data: { ...examData, status: 'scheduled' },
    });

    if (questions?.length) {
      await this.prisma.question.createMany({
        data: questions.map((q, i) => ({
          examId: exam.id,
          text: q.text,
          type: q.type,
          options: q.options ? JSON.stringify(q.options) : undefined,
          correctAnswer: q.correctAnswer,
          marks: q.marks || 1,
          order: i,
        })),
      });
    }

    return exam;
  }

  async getAllExams() {
    return this.prisma.exam.findMany({
      include: { course: true, _count: { select: { sessions: true } } },
      orderBy: { startTime: 'desc' },
    });
  }
}
