import { useEffect, useState, useRef } from "react";
import { quizService } from "../../services/quiz.service";
import type { QuizFetchResponse, QuizTest } from "../../services/quiz.service";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "../../components/ui/dialog";
import { subjectService } from "../../services/subject.service";
import type { Subject } from "../../services/subject.service";
import { serverUrl } from "../../common/api/axios-instance";

// Helper to get remaining time from localStorage or default (3 hours)
const getInitialTime = () => {
  const saved = localStorage.getItem("quiz-remaining-time");
  return saved ? parseInt(saved, 10) : 3 * 60 * 60; // 3 hours in seconds
};

type QuizResult = {
  totalScore: number;
  createdAt: string;
  main: { subject: string; correctAnswers: number; score: number };
  addition: { subject: string; correctAnswers: number; score: number };
  mandatory: Array<{ _id: string; subject: string; correctAnswers: number; score: number }>;
};

export default function Quiz() {
  const { blockId } = useParams();
  const { user } = useAuth();

  const navigate = useNavigate();

  const [quiz, setQuiz] = useState<QuizFetchResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>(() => {
    const saved = localStorage.getItem("quiz-answers");
    return saved ? JSON.parse(saved) : {};
  });
  const [remaining, setRemaining] = useState(getInitialTime());
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const autoSaveRef = useRef<NodeJS.Timeout | null>(null);
  const [warning, setWarning] = useState(false);
  const [resultModalOpen, setResultModalOpen] = useState(false);
  const [quizResult, setQuizResult] = useState<QuizResult | null>(null);
  const [subjects, setSubjects] = useState<Subject[]>([]);


  // Fetch quiz data
  useEffect(() => {
    if (!blockId) return;
    // Reset timer for new test
    const defaultTime = 3 * 60 * 60;
    localStorage.setItem("quiz-remaining-time", defaultTime.toString());
    setRemaining(defaultTime);
    // Reset answers for new test
    localStorage.removeItem("quiz-answers");
    setAnswers({});
    setLoading(true);
    quizService
      .fetchQuiz(blockId)
      .then((data) => {
        // Shuffle options for each question
        function shuffleArray<T>(array: T[]): T[] {
          const arr = [...array];
          for (let i = arr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [arr[i], arr[j]] = [arr[j], arr[i]];
          }
          return arr;
        }
        // Helper to shuffle options in all tests
        const shuffleOptionsInTests = (tests: QuizTest[]): QuizTest[] =>
          tests?.map((test) => ({ ...test, options: shuffleArray(test.options) })) || [];
        // Clone and shuffle quiz data
        const shuffledQuiz: QuizFetchResponse = {
          ...data,
          main: {
            ...data.main,
            tests: shuffleOptionsInTests(data.main?.tests || []),
          },
          addition: {
            ...data.addition,
            tests: shuffleOptionsInTests(data.addition?.tests || []),
          },
          mandatory: (data.mandatory || []).map((m) => ({
            ...m,
            tests: shuffleOptionsInTests(m.tests || []),
          })),
        };
        setQuiz(shuffledQuiz);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [blockId]);

  // Timer logic
  useEffect(() => {
    if (loading) return;
    timerRef.current = setInterval(() => {
      setRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          handleFinish();
          return 0;
        }
        localStorage.setItem("quiz-remaining-time", (prev - 1).toString());
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current!);
  }, [loading]);

  // Auto-save every minute
  useEffect(() => {
    if (loading) return;
    autoSaveRef.current = setInterval(() => {
      quizService.autoSaveQuiz({ blockId: blockId || "", answers, remaining });
    }, 60000);
    return () => clearInterval(autoSaveRef.current!);
  }, [answers, remaining, loading, blockId]);

  // Save answers to localStorage on change
  useEffect(() => {
    localStorage.setItem("quiz-answers", JSON.stringify(answers));
  }, [answers]);

  // Warn on reload/navigation
  useEffect(() => {
    const beforeUnload = (e: BeforeUnloadEvent) => {
      setWarning(true);
      quizService.autoSaveQuiz({ blockId: blockId || "", answers, remaining });
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", beforeUnload);
    return () => window.removeEventListener("beforeunload", beforeUnload);
  }, [answers, remaining, blockId]);

  // Handle finish (manual or auto)
  const handleFinish = async () => {
    if (!quiz || !user || !blockId) return;

    // Helper to extract subjectId
    const getSubjectId = (tests: QuizTest[], fallbackSubjectId?: string) => {
      if (tests && tests.length > 0) {
        return tests[0]?.subject?._id || "";
      }
      return fallbackSubjectId || "";
    };

    // Helper to get answers for a group of tests
    const getAnswers = (tests: QuizTest[]) =>
      tests.map((test) => answers[test._id]).filter(Boolean);

    // Main
    const mainSubjectId = getSubjectId(
      quiz.main?.tests || [],
      quiz.main?.subject?._id
    );
    const mainAnswers = getAnswers(quiz.main?.tests || []);
    const main = {
      subject: mainSubjectId,
      answers: mainAnswers,
    };

    // Addition
    const additionSubjectId = getSubjectId(
      quiz.addition?.tests || [],
      quiz.addition?.subject?._id
    );
    const additionAnswers = getAnswers(quiz.addition?.tests || []);
    const addition = {
      subject: additionSubjectId,
      answers: additionAnswers,
    };

    // Mandatory
    const mandatory = (quiz.mandatory || []).map((m) => {
      const subjectId = m.subject?._id || "";
      const mAnswers = getAnswers(m.tests);
      return { subject: subjectId, answers: mAnswers };
    });

    const payload = {
      block: blockId,
      main,
      addition,
      mandatory,
    };

    const data = await quizService.saveQuizResult(payload);
    setQuizResult(data as QuizResult);
    setResultModalOpen(true);
    localStorage.removeItem("quiz-answers");
    localStorage.removeItem("quiz-remaining-time");
  };

  // Handle answer selection
  const handleAnswer = (questionId: string, optionId: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: optionId }));
  };

  // UI helpers
  const formatTime = (sec: number) => {
    const h = Math.floor(sec / 3600)
      .toString()
      .padStart(2, "0");
    const m = Math.floor((sec % 3600) / 60)
      .toString()
      .padStart(2, "0");
    const s = (sec % 60).toString().padStart(2, "0");
    return `${h}:${m}:${s}`;
  };

  const handleCloseModal = () => {
    setResultModalOpen(false);
    navigate("/blocks");
  };

  useEffect(() => {
    subjectService.getAll().then(setSubjects).catch(() => setSubjects([]));
  }, []);

  // Helper to get subject name by id
  const getSubjectName = (id: string) => subjects.find((s) => s._id === id)?.name || "Fan nomi";

  if (loading) return <div>Loading...</div>;
  if (!quiz) return <div>Quiz not found</div>;

  // Flatten all questions for navigation (main, addition, mandatory)
  const allQuestions: QuizTest[] = [
    ...(quiz.main?.tests || []),
    ...(quiz.addition?.tests || []),
    ...(quiz.mandatory || []).flatMap((m) => m.tests),
  ];
  const currentQuestion = allQuestions[current];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center font-bold text-blue-600">
                B
              </div>
              <div>
                <h1 className="text-lg font-bold text-gray-900">{quiz.block.name}</h1>
                <p className="text-sm text-gray-600">
                  {current + 1}/{allQuestions.length}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2 bg-red-50 px-4 py-2 rounded-lg">
                <span className="font-mono text-lg font-bold text-red-600">
                  {formatTime(remaining)}
                </span>
              </div>
              <button
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                onClick={handleFinish}
              >
                Testni tugatish
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Question Navigation */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 sticky top-24">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Savollar</h3>
              <div className="grid grid-cols-1 gap-2">
                {/* Main subject questions */}
                <div className="mb-2">
                  <div className="text-xs font-semibold text-blue-700 mb-1">
                    {quiz.main.subject?.name || "Asosiy fan"}
                  </div>
                  <div className="grid grid-cols-5 gap-1 border p-1 rounded min-h-10">
                    {quiz?.main?.tests?.map((q, i) => (
                      <button
                        key={q._id}
                        className={`w-8 h-8 text-xs font-medium rounded ${
                          answers[q._id]
                            ? "bg-green-200 text-green-700"
                            : "bg-gray-100 text-gray-600"
                        } ${i === current ? "ring-2 ring-blue-500" : ""}`}
                        onClick={() =>
                          setCurrent(
                            allQuestions.findIndex((qq) => qq._id === q._id)
                          )
                        }
                      >
                        {allQuestions.findIndex((qq) => qq._id === q._id) + 1}
                      </button>
                    ))}
                  </div>
                </div>
                {/* Addition subject questions */}
                <div className="mb-2">
                  <div className="text-xs font-semibold text-purple-700 mb-1">
                    {quiz.addition.subject?.name || "Qo'shimcha fan"}
                  </div>
                  <div className="grid grid-cols-5 gap-1 border p-1 rounded min-h-10">
                    {quiz?.addition?.tests?.map((q) => (
                      <button
                        key={q._id}
                        className={`w-8 h-8 text-xs font-medium rounded ${
                          answers[q._id]
                            ? "bg-green-200 text-green-700"
                            : "bg-gray-100 text-gray-600"
                        } ${
                          allQuestions.findIndex((qq) => qq._id === q._id) ===
                          current
                            ? "ring-2 ring-blue-500"
                            : ""
                        }`}
                        onClick={() =>
                          setCurrent(
                            allQuestions.findIndex((qq) => qq._id === q._id)
                          )
                        }
                      >
                        {allQuestions.findIndex((qq) => qq._id === q._id) + 1}
                      </button>
                    ))}
                  </div>
                </div>
                {/* Mandatory subjects questions */}
                <div>
                  <p className="border mt-4 mb-6"></p>
                  {quiz.mandatory?.map((m, idx) => (
                    <div className="mb-2" key={(m.subject?._id || 'subject') + '-' + idx}>
                      <div className="text-xs font-semibold text-green-700 mb-1">
                        {m.subject?.name || "Majburiy fan"}
                      </div>
                      <div className="grid grid-cols-5 gap-1 border p-1 rounded min-h-10">
                        {m.tests.map((q) => (
                          <button
                            key={q._id}
                            className={`w-8 h-8 text-xs font-medium rounded ${
                              answers[q._id]
                                ? "bg-green-200 text-green-700"
                                : "bg-gray-100 text-gray-600"
                            } ${
                              allQuestions.findIndex(
                                (qq) => qq._id === q._id
                              ) === current
                                ? "ring-2 ring-blue-500"
                                : ""
                            }`}
                            onClick={() =>
                              setCurrent(
                                allQuestions.findIndex((qq) => qq._id === q._id)
                              )
                            }
                          >
                            {allQuestions.findIndex((qq) => qq._id === q._id) +
                              1}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="mt-6 pt-4 border-t border-gray-200">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Javob berilgan:</span>
                  <span className="font-medium text-green-600">
                    {Object.keys(answers).length}/{allQuestions.length}
                  </span>
                </div>
              </div>
            </div>
          </div>
          {/* Question Content */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8">
              <div className="flex items-center justify-between mb-6">
                <span className="bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full font-medium">
                  {currentQuestion?.subject?.name || "Fan"}
                </span>
                <span className="text-sm text-gray-500">
                  {current + 1}. savol
                </span>
              </div>
              <div className="mb-8">
                <h2 className="text-xl font-bold text-gray-900 mb-6 leading-relaxed">
                  {current + 1}. {currentQuestion?.question}
                </h2>
                {(currentQuestion?.type === "file" || currentQuestion?.type === "url") && currentQuestion?.target && (
                  <img
                    src={currentQuestion.type === "url" ? currentQuestion.target : serverUrl + '/quiz' + currentQuestion.target}
                    alt="Savol rasmi"
                    className="mb-4 max-h-64 object-contain"
                  />
                )}
                {/* Options */}
                <div className="space-y-4">
                  {(currentQuestion?.options || []).map((opt, idx) => (
                    <button
                      key={opt._id}
                      className={`w-full text-left p-4 rounded-lg border-2 ${
                        answers[currentQuestion._id] === opt._id
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                      }`}
                      onClick={() => handleAnswer(currentQuestion._id, opt._id)}
                    >
                      <div className="flex items-start space-x-3">
                        <span className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold bg-gray-200 text-gray-600">
                          {String.fromCharCode(65 + idx)}
                        </span>
                        <div className="flex-1">
                          {(opt.type === "file" || opt.type === "url") ? (
                            <img
                              src={opt.type === "url" ? opt.value : serverUrl + '/quiz' + opt.value}
                              alt="Variant rasmi"
                              className="mb-2 max-h-32 object-contain"
                            />
                          ) : (
                            <span className="text-gray-900 block mb-2">{opt.value}</span>
                          )}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
              {/* Navigation */}
              <div className="flex items-center justify-between pt-6 border-t border-gray-200">
                <button
                  className="flex items-center space-x-2 px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  onClick={() => setCurrent((c) => Math.max(0, c - 1))}
                  disabled={current === 0}
                >
                  <span>&lt;</span>
                  <span>Oldingi</span>
                </button>
                <button
                  className="flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  onClick={() =>
                    setCurrent((c) => Math.min(allQuestions.length - 1, c + 1))
                  }
                  disabled={current === allQuestions.length - 1}
                >
                  <span>Keyingi</span>
                  <span>&gt;</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Warning Modal */}
      {warning && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded shadow-lg">
            <h2 className="text-lg font-bold mb-4">Diqqat!</h2>
            <p className="mb-4">
              Sahifani yangilash yoki tark etish test natijalarini avtomatik
              saqlaydi.
            </p>
            <button
              className="bg-blue-600 text-white px-4 py-2 rounded"
              onClick={() => setWarning(false)}
            >
              OK
            </button>
          </div>
        </div>
      )}
      {resultModalOpen && quizResult && (
        <Dialog open={resultModalOpen} onOpenChange={(open) => { if (!open) handleCloseModal(); }}>
          <DialogContent className="w-full p-0 max-w-[1000px]">
            <DialogHeader className="bg-blue-600 py-6 px-8">
              <DialogTitle className="text-white text-2xl text-center">Test natijalari</DialogTitle>
              <DialogDescription className="text-blue-100 text-center mt-2">Quyida sizning test natijalaringiz</DialogDescription>
            </DialogHeader>
            <div className="p-8 bg-white">
              <div className="mb-6 flex flex-col items-center">
                <span className="text-lg font-semibold text-gray-700">Umumiy ball</span>
                <span className="text-4xl font-bold text-green-600 mt-2 mb-2">{quizResult.totalScore}</span>
                <span className="text-gray-500 text-sm">{new Date(quizResult.createdAt).toLocaleString()}</span>
              </div>
              <div className="mb-8">
                <div className="flex items-center gap-4">
                <div className="mb-4 p-4 rounded-lg border-l-4 border-blue-500 bg-blue-50 flex-1">
                  <h2 className="font-semibold text-lg mb-2 text-blue-700">{getSubjectName(quizResult.main.subject) || "Asosiy fan"}</h2>
                  <div className="flex justify-between mb-1">
                    <span>To'g'ri javoblar:</span>
                    <span className="font-bold">{quizResult.main.correctAnswers}</span>
                  </div>
                  <div className="flex justify-between mb-1">
                    <span>Ball:</span>
                    <span className="font-bold">{quizResult.main.score}</span>
                  </div>
                </div>
                <div className="mb-4 p-4 rounded-lg border-r-4 border-purple-500 bg-purple-50 flex-1">
                  <h2 className="font-semibold text-lg mb-2 text-purple-700">{getSubjectName(quizResult.addition.subject) || "Qo'shimcha fan"}</h2>
                  <div className="flex justify-between mb-1">
                    <span>To'g'ri javoblar:</span>
                    <span className="font-bold">{quizResult.addition.correctAnswers}</span>
                  </div>
                  <div className="flex justify-between mb-1">
                    <span>Ball:</span>
                    <span className="font-bold">{quizResult.addition.score}</span>
                  </div>
                </div>
                </div>
                <div className="mb-2">
                  <h2 className="font-semibold text-lg mb-2 text-green-700">Majburiy fanlar</h2>
                  {quizResult.mandatory.map((m) => (
                    <div key={m._id} className="mb-2 p-3 rounded border bg-green-50">
                      <div className="flex justify-between mb-1">
                        <span className="font-semibold">{getSubjectName(m.subject)}</span>
                        <span>To'g'ri javoblar: <span className="font-bold">{m.correctAnswers}</span></span>
                      </div>
                      <div className="flex justify-between mb-1">
                        <span>Ball:</span>
                        <span className="font-bold">{m.score}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex justify-center mt-8">
                <button
                  onClick={handleCloseModal}
                  className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors text-lg font-semibold shadow"
                >
                  Barcha bloklar sahifasiga o'tish
                </button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
