import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { buildQuizSession, QuizQuestion } from '../data/quiz';
import { loadProgress, recordQuizSession, updateStreak } from '../data/progress';
import { colors, spacing, radius } from '../theme';
import { strings } from '../i18n/strings';

type QuizState = 'home' | 'question' | 'answer' | 'result';

export default function PracticeScreen() {
  const [quizState, setQuizState] = useState<QuizState>('home');
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [finalScore, setFinalScore] = useState(0);
  const [streak, setStreak] = useState(0);

  useFocusEffect(
    useCallback(() => {
      updateStreak();
      loadProgress().then((p) => setStreak(p.streak.current));
    }, [])
  );

  const startQuiz = () => {
    const session = buildQuizSession(10);
    setQuestions(session);
    setCurrentIndex(0);
    setScore(0);
    setFinalScore(0);
    setSelectedAnswer(null);
    setQuizState('question');
  };

  const handleAnswer = (answer: string) => {
    setSelectedAnswer(answer);
    setQuizState('answer');
  };

  const handleNext = async () => {
    const question = questions[currentIndex];
    const isCorrect = selectedAnswer === question.correctAnswer;
    const newScore = isCorrect ? score + 1 : score;
    setScore(newScore);

    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setSelectedAnswer(null);
      setQuizState('question');
    } else {
      setFinalScore(newScore);
      await recordQuizSession(newScore, questions.length, questions.map((q) => q.id));
      setQuizState('result');
    }
  };

  if (quizState === 'home') {
    return <HomeView onStart={startQuiz} streak={streak} />;
  }

  if (quizState === 'result') {
    return (
      <ResultView
        score={finalScore}
        total={questions.length}
        onRestart={() => setQuizState('home')}
        onRetry={startQuiz}
      />
    );
  }

  const question = questions[currentIndex];

  return (
    <QuestionView
      question={question}
      questionNumber={currentIndex + 1}
      total={questions.length}
      selectedAnswer={selectedAnswer}
      showAnswer={quizState === 'answer'}
      score={score}
      onAnswer={handleAnswer}
      onNext={handleNext}
      onQuit={() => setQuizState('home')}
    />
  );
}

function HomeView({ onStart, streak }: { onStart: () => void; streak: number }) {
  const questionTypes = [
    { icon: 'color-palette-outline', label: 'Color note', desc: 'Name the defining note' },
    { icon: 'layers-outline', label: 'Chord context', desc: 'Which mode fits this chord?' },
    { icon: 'musical-notes-outline', label: 'Classic tunes', desc: 'Match mode to recording' },
    { icon: 'sunny-outline', label: 'Brightness', desc: 'Dark, neutral, or bright?' },
  ];

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.homeContent} showsVerticalScrollIndicator={false}>
        <View style={styles.homeHeader}>
          <Text style={styles.heading}>{strings.practice.heading}</Text>
          <Text style={styles.subheading}>{strings.practice.subheading}</Text>
        </View>

        {streak > 0 && (
          <View style={styles.streakCard}>
            <Ionicons name="flame" size={20} color={colors.warning} />
            <Text style={styles.streakText}>
              {strings.practice.streakDays(streak)} streak
            </Text>
          </View>
        )}

        <View style={styles.quizCard}>
          <Text style={styles.quizCardTitle}>{strings.practice.quizTitle}</Text>
          <Text style={styles.quizCardSubtitle}>10 questions · mixed difficulty</Text>
          <View style={styles.typeList}>
            {questionTypes.map((t, i) => (
              <View key={i} style={styles.typeRow}>
                <View style={styles.typeIconWrap}>
                  <Ionicons name={t.icon as any} size={16} color={colors.accent} />
                </View>
                <View style={styles.typeText}>
                  <Text style={styles.typeLabel}>{t.label}</Text>
                  <Text style={styles.typeDesc}>{t.desc}</Text>
                </View>
              </View>
            ))}
          </View>
          <TouchableOpacity style={styles.startButton} onPress={onStart}>
            <Text style={styles.startButtonText}>{strings.practice.startQuiz}</Text>
            <Ionicons name="arrow-forward" size={16} color={colors.bg} />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function QuestionView({
  question, questionNumber, total, selectedAnswer,
  showAnswer, score, onAnswer, onNext, onQuit,
}: {
  question: QuizQuestion; questionNumber: number; total: number;
  selectedAnswer: string | null; showAnswer: boolean; score: number;
  onAnswer: (a: string) => void; onNext: () => void; onQuit: () => void;
}) {
  const progress = questionNumber / total;
  const isCorrect = selectedAnswer === question.correctAnswer;

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.navBar}>
        <TouchableOpacity onPress={onQuit} style={styles.quitButton}>
          <Ionicons name="close" size={22} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.questionCount}>{questionNumber} / {total}</Text>
        <Text style={styles.scoreDisplay}>{score} ✓</Text>
      </View>

      <View style={styles.progressTrack}>
        <View style={[styles.progressFill, { width: `${progress * 100}%` }]} />
      </View>

      <ScrollView contentContainerStyle={styles.questionContent} showsVerticalScrollIndicator={false}>
        <View style={styles.difficultyRow}>
          <View style={[styles.difficultyPill, {
            backgroundColor: question.difficulty === 'beginner'
              ? colors.success + '22'
              : question.difficulty === 'intermediate'
              ? colors.warning + '22'
              : colors.dark + '22',
          }]}>
            <Text style={[styles.difficultyText, {
              color: question.difficulty === 'beginner'
                ? colors.success
                : question.difficulty === 'intermediate'
                ? colors.warning
                : colors.dark,
            }]}>
              {question.difficulty}
            </Text>
          </View>
        </View>

        <Text style={styles.prompt}>{question.prompt}</Text>

        <View style={styles.optionsGrid}>
          {question.options.map((option) => {
            const isSelected = selectedAnswer === option;
            const isCorrectOption = option === question.correctAnswer;
            let optionStyle = styles.option;
            let textStyle = styles.optionText;
            if (showAnswer) {
              if (isCorrectOption) {
                optionStyle = { ...styles.option, ...styles.optionCorrect };
                textStyle = { ...styles.optionText, color: colors.success };
              } else if (isSelected && !isCorrectOption) {
                optionStyle = { ...styles.option, ...styles.optionWrong };
                textStyle = { ...styles.optionText, color: colors.warning };
              } else {
                optionStyle = { ...styles.option, ...styles.optionDim };
              }
            } else if (isSelected) {
              optionStyle = { ...styles.option, ...styles.optionSelected };
            }
            return (
              <TouchableOpacity
                key={option}
                style={optionStyle}
                onPress={() => !showAnswer && onAnswer(option)}
                activeOpacity={showAnswer ? 1 : 0.8}
              >
                {showAnswer && isCorrectOption && (
                  <Ionicons name="checkmark-circle" size={16} color={colors.success} />
                )}
                {showAnswer && isSelected && !isCorrectOption && (
                  <Ionicons name="close-circle" size={16} color={colors.warning} />
                )}
                <Text style={textStyle}>{option}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {showAnswer && (
          <View style={[styles.explanationCard, { borderLeftColor: isCorrect ? colors.success : colors.warning }]}>
            <View style={styles.explanationHeader}>
              <Ionicons
                name={isCorrect ? 'checkmark-circle' : 'information-circle'}
                size={16}
                color={isCorrect ? colors.success : colors.warning}
              />
              <Text style={[styles.explanationLabel, { color: isCorrect ? colors.success : colors.warning }]}>
                {isCorrect ? strings.practice.correct : strings.practice.incorrect}
              </Text>
            </View>
            <Text style={styles.explanationText}>{question.explanation}</Text>
          </View>
        )}
        <View style={{ height: 100 }} />
      </ScrollView>

      {showAnswer && (
        <View style={styles.footer}>
          <TouchableOpacity style={styles.nextButton} onPress={onNext}>
            <Text style={styles.nextButtonText}>
              {questionNumber === total ? strings.practice.seeResult : strings.practice.nextQuestion}
            </Text>
            <Ionicons name="arrow-forward" size={16} color={colors.bg} />
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}

function ResultView({
  score, total, onRestart, onRetry,
}: {
  score: number; total: number; onRestart: () => void; onRetry: () => void;
}) {
  const percentage = Math.round((score / total) * 100);
  const getMessage = () => {
    if (percentage === 100) return strings.practice.perfectScore;
    if (percentage >= 70) return strings.practice.goodScore;
    return strings.practice.lowScore;
  };
  const getColor = () => {
    if (percentage === 100) return colors.success;
    if (percentage >= 70) return colors.accent;
    return colors.warning;
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.resultContainer}>
        <View style={[styles.scoreCircle, { borderColor: getColor() }]}>
          <Text style={[styles.scoreNumber, { color: getColor() }]}>{score}</Text>
          <Text style={styles.scoreTotal}>of {total}</Text>
        </View>
        <Text style={styles.percentage}>{percentage}%</Text>
        <Text style={styles.resultMessage}>{getMessage()}</Text>

        <View style={styles.breakdownCard}>
          <View style={styles.breakdownRow}>
            <Text style={styles.breakdownLabel}>Correct</Text>
            <Text style={[styles.breakdownValue, { color: colors.success }]}>{score}</Text>
          </View>
          <View style={styles.breakdownRow}>
            <Text style={styles.breakdownLabel}>Incorrect</Text>
            <Text style={[styles.breakdownValue, { color: colors.warning }]}>{total - score}</Text>
          </View>
          <View style={[styles.breakdownRow, { borderBottomWidth: 0 }]}>
            <Text style={styles.breakdownLabel}>Total</Text>
            <Text style={styles.breakdownValue}>{total}</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.restartButton} onPress={onRestart}>
          <Text style={styles.restartText}>Back to practice</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.retryButton} onPress={onRetry}>
          <Ionicons name="refresh" size={16} color={colors.accent} />
          <Text style={styles.retryText}>Try again</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  homeContent: { paddingHorizontal: spacing.lg, paddingBottom: spacing.xxl },
  homeHeader: { paddingTop: spacing.lg, paddingBottom: spacing.lg },
  heading: { fontSize: 32, fontWeight: '300', color: colors.textPrimary, letterSpacing: 1.5 },
  subheading: { fontSize: 14, color: colors.textSecondary, marginTop: 4 },
  streakCard: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.sm,
    backgroundColor: colors.bgCard, borderRadius: radius.md,
    borderWidth: 1, borderColor: colors.warning + '44',
    padding: spacing.md, marginBottom: spacing.md,
  },
  streakText: { fontSize: 14, color: colors.warning, fontWeight: '500' },
  quizCard: {
    backgroundColor: colors.bgCard, borderRadius: radius.lg,
    borderWidth: 1, borderColor: colors.border, padding: spacing.lg,
  },
  quizCardTitle: { fontSize: 20, fontWeight: '500', color: colors.textPrimary, marginBottom: 4 },
  quizCardSubtitle: { fontSize: 13, color: colors.textTertiary, marginBottom: spacing.lg },
  typeList: { gap: spacing.md, marginBottom: spacing.lg },
  typeRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  typeIconWrap: {
    width: 32, height: 32, borderRadius: radius.sm,
    backgroundColor: colors.accentMuted, alignItems: 'center', justifyContent: 'center',
  },
  typeText: { flex: 1 },
  typeLabel: { fontSize: 14, color: colors.textPrimary, fontWeight: '500' },
  typeDesc: { fontSize: 12, color: colors.textTertiary },
  startButton: {
    backgroundColor: colors.accent, borderRadius: radius.md,
    paddingVertical: 14, alignItems: 'center',
    flexDirection: 'row', justifyContent: 'center', gap: spacing.sm,
  },
  startButtonText: { fontSize: 15, fontWeight: '600', color: colors.bg },
  navBar: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: spacing.lg, paddingVertical: spacing.sm,
  },
  quitButton: { padding: 4 },
  questionCount: { fontSize: 13, color: colors.textSecondary },
  scoreDisplay: { fontSize: 13, color: colors.success, fontWeight: '600' },
  progressTrack: {
    height: 2, backgroundColor: colors.border,
    marginHorizontal: spacing.lg, borderRadius: 1, marginBottom: spacing.lg,
  },
  progressFill: { height: 2, backgroundColor: colors.accent, borderRadius: 1 },
  questionContent: { paddingHorizontal: spacing.lg },
  difficultyRow: { marginBottom: spacing.md },
  difficultyPill: { alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 3, borderRadius: radius.full },
  difficultyText: { fontSize: 11, fontWeight: '600', letterSpacing: 0.5 },
  prompt: {
    fontSize: 22, fontWeight: '300', color: colors.textPrimary,
    lineHeight: 32, marginBottom: spacing.xl,
  },
  optionsGrid: { gap: spacing.sm, marginBottom: spacing.lg },
  option: {
    backgroundColor: colors.bgCard, borderRadius: radius.md,
    borderWidth: 1, borderColor: colors.border,
    padding: spacing.md, flexDirection: 'row', alignItems: 'center', gap: spacing.sm,
  },
  optionSelected: { borderColor: colors.accent, backgroundColor: colors.accentMuted },
  optionCorrect: { borderColor: colors.success, backgroundColor: colors.success + '11' },
  optionWrong: { borderColor: colors.warning, backgroundColor: colors.warning + '11' },
  optionDim: { opacity: 0.4 },
  optionText: { fontSize: 15, color: colors.textPrimary, flex: 1 },
  explanationCard: {
    backgroundColor: colors.bgCard, borderRadius: radius.md,
    borderLeftWidth: 3, padding: spacing.md,
  },
  explanationHeader: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: spacing.sm },
  explanationLabel: { fontSize: 11, fontWeight: '600', letterSpacing: 1, textTransform: 'uppercase' },
  explanationText: { fontSize: 14, color: colors.textSecondary, lineHeight: 22 },
  footer: { paddingHorizontal: spacing.lg, paddingBottom: spacing.lg, paddingTop: spacing.sm },
  nextButton: {
    backgroundColor: colors.accent, borderRadius: radius.md,
    paddingVertical: 14, alignItems: 'center',
    flexDirection: 'row', justifyContent: 'center', gap: spacing.sm,
  },
  nextButtonText: { fontSize: 15, fontWeight: '600', color: colors.bg },
  resultContainer: {
    flex: 1, alignItems: 'center', justifyContent: 'center',
    paddingHorizontal: spacing.lg, gap: spacing.lg,
  },
  scoreCircle: {
    width: 120, height: 120, borderRadius: 60,
    borderWidth: 3, alignItems: 'center', justifyContent: 'center',
  },
  scoreNumber: { fontSize: 40, fontWeight: '200' },
  scoreTotal: { fontSize: 13, color: colors.textTertiary },
  percentage: { fontSize: 48, fontWeight: '200', color: colors.textPrimary },
  resultMessage: {
    fontSize: 16, color: colors.textSecondary,
    textAlign: 'center', lineHeight: 24, maxWidth: 280,
  },
  breakdownCard: {
    backgroundColor: colors.bgCard, borderRadius: radius.md,
    borderWidth: 1, borderColor: colors.border, width: '100%', overflow: 'hidden',
  },
  breakdownRow: {
    flexDirection: 'row', justifyContent: 'space-between',
    paddingHorizontal: spacing.md, paddingVertical: 12,
    borderBottomWidth: 1, borderBottomColor: colors.border,
  },
  breakdownLabel: { fontSize: 14, color: colors.textSecondary },
  breakdownValue: { fontSize: 14, fontWeight: '600', color: colors.textPrimary },
  restartButton: {
    backgroundColor: colors.accent, borderRadius: radius.md,
    paddingVertical: 14, width: '100%', alignItems: 'center',
  },
  restartText: { fontSize: 15, fontWeight: '600', color: colors.bg },
  retryButton: { flexDirection: 'row', alignItems: 'center', gap: 6, padding: spacing.md },
  retryText: { fontSize: 14, color: colors.accent },
});
