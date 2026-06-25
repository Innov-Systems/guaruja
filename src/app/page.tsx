"use client";

import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import {
  ArrowRight,
  BarChart3,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Clock,
  Download,
  Eye,
  EyeOff,
  LoaderCircle,
  LogOut,
  Pencil,
  Phone,
  Plus,
  Save,
  Trash2,
  UserRound,
  WalletCards,
  X,
} from "lucide-react";
import { FormEvent, useEffect, useMemo, useState } from "react";
import {
  auth,
  allowedEmails,
  db,
  isFirebaseConfigured,
} from "@/lib/firebase";
import { FirebaseError } from "firebase/app";
import {
  formatFullDate,
  formatShortDate,
  getMonthMatrix,
  getMonthRange,
  monthNames,
  toDateKey,
  weekdayNames,
} from "@/lib/date";
import type {
  Reservation,
  ReservationFormData,
  ReservationStatus,
} from "@/types/reservation";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  type User,
} from "firebase/auth";

const statusLabels: Record<ReservationStatus, string> = {
  "pre-reserva": "Pre-reserva",
  reservado: "Reservado",
  "sinal-pago": "Sinal pago",
  pago: "Pago",
  cancelado: "Cancelado",
};

const statusClasses: Record<ReservationStatus, string> = {
  "pre-reserva": "border-amber-200 bg-amber-50 text-amber-800",
  reservado: "border-sky-200 bg-sky-50 text-sky-800",
  "sinal-pago": "border-violet-200 bg-violet-50 text-violet-800",
  pago: "border-emerald-200 bg-emerald-50 text-emerald-800",
  cancelado: "border-rose-200 bg-rose-50 text-rose-800",
};

const initialForm: ReservationFormData = {
  customerName: "",
  phone: "",
  date: toDateKey(new Date()),
  startTime: "09:00",
  endTime: "18:00",
  totalValue: 0,
  depositValue: 0,
  status: "reservado",
  notes: "",
};

function currency(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    currency: "BRL",
    style: "currency",
  }).format(value || 0);
}

function sortReservations(items: Reservation[]) {
  return [...items].sort((a, b) => {
    const dateCompare = a.date.localeCompare(b.date);
    return dateCompare || a.startTime.localeCompare(b.startTime);
  });
}

function toMonthInputValue(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
}

export default function Home() {
  const [authUser, setAuthUser] = useState<User | null>(null);
  const [authChecked, setAuthChecked] = useState(!auth);
  const [authError, setAuthError] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSigningIn, setIsSigningIn] = useState(false);

  const [selectedDate, setSelectedDate] = useState(toDateKey(new Date()));
  const [monthDate, setMonthDate] = useState(new Date());
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [formData, setFormData] = useState<ReservationFormData>(initialForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [activeView, setActiveView] = useState<"dashboard" | "schedule">(
    "dashboard",
  );

  useEffect(() => {
    const currentAuth = auth;

    if (!currentAuth) {
      return;
    }

    return onAuthStateChanged(currentAuth, async (user) => {
      if (
        user?.email &&
        allowedEmails?.length &&
        !allowedEmails.includes(user.email.toLowerCase())
      ) {
        await signOut(currentAuth);
        setAuthError("Este e-mail nao esta liberado para acessar a agenda.");
        setAuthUser(null);
        setAuthChecked(true);
        return;
      }

      setAuthUser(user);
      setAuthChecked(true);
    });
  }, []);

  useEffect(() => {
    if (!db || !authUser) {
      return;
    }

    const range = getMonthRange(monthDate);
    const reservationsQuery = query(
      collection(db, "reservations"),
      where("date", ">=", range.start),
      where("date", "<=", range.end),
    );

    return onSnapshot(
      reservationsQuery,
      (snapshot) => {
        const data = snapshot.docs.map((reservationDoc) => ({
          id: reservationDoc.id,
          ...reservationDoc.data(),
        })) as Reservation[];

        setReservations(sortReservations(data));
        setSaveError("");
      },
      (error) => {
        setSaveError(error.message);
      },
    );
  }, [authUser, monthDate]);

  const calendarDays = useMemo(() => getMonthMatrix(monthDate), [monthDate]);

  const reservationCountByDate = useMemo(() => {
    return reservations.reduce<Record<string, number>>((acc, reservation) => {
      acc[reservation.date] = (acc[reservation.date] || 0) + 1;
      return acc;
    }, {});
  }, [reservations]);

  const selectedReservations = useMemo(() => {
    return reservations.filter((reservation) => reservation.date === selectedDate);
  }, [reservations, selectedDate]);

  const monthSummary = useMemo(() => {
    const activeReservations = reservations.filter(
      (reservation) => reservation.status !== "cancelado",
    );

    return {
      reservations: activeReservations.length,
      received: activeReservations.reduce(
        (sum, reservation) => sum + Number(reservation.depositValue || 0),
        0,
      ),
      expected: activeReservations.reduce(
        (sum, reservation) => sum + Number(reservation.totalValue || 0),
        0,
      ),
    };
  }, [reservations]);

  const upcomingReservations = useMemo(() => {
    const today = toDateKey(new Date());

    return reservations
      .filter(
        (reservation) =>
          reservation.status !== "cancelado" && reservation.date >= today,
      )
      .slice(0, 5);
  }, [reservations]);

  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!auth) {
      return;
    }

    setIsSigningIn(true);
    setAuthError("");

    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      if (error instanceof FirebaseError) {
        const messages: Record<string, string> = {
          "auth/invalid-credential":
            "E-mail ou senha incorretos. Confira o usuario criado no Firebase.",
          "auth/user-not-found":
            "Este e-mail ainda nao existe no Firebase Authentication.",
          "auth/wrong-password": "Senha incorreta para este e-mail.",
          "auth/operation-not-allowed":
            "Ative o login por e-mail e senha no Firebase Authentication.",
          "auth/too-many-requests":
            "Muitas tentativas. Aguarde um pouco ou redefina a senha no Firebase.",
          "auth/api-key-not-valid.-please-pass-a-valid-api-key.":
            "A chave API do Firebase esta invalida. Copie o apiKey novamente para o .env.local.",
        };

        setAuthError(
          messages[error.code] || `Erro do Firebase: ${error.code}`,
        );
        return;
      }

      setAuthError("Nao foi possivel entrar. Confira e-mail e senha.");
    } finally {
      setIsSigningIn(false);
    }
  }

  async function handleSave(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!db || !authUser) {
      return;
    }

    setIsSaving(true);
    setSaveError("");

    const payload = {
      ...formData,
      customerName: formData.customerName.trim(),
      phone: formData.phone.trim(),
      notes: formData.notes.trim(),
      totalValue: Number(formData.totalValue || 0),
      depositValue: Number(formData.depositValue || 0),
      updatedAt: serverTimestamp(),
    };

    try {
      if (editingId) {
        await updateDoc(doc(db, "reservations", editingId), payload);
      } else {
        await addDoc(collection(db, "reservations"), {
          ...payload,
          createdAt: serverTimestamp(),
        });
      }

      setEditingId(null);
      setFormData({ ...initialForm, date: selectedDate });
    } catch (error) {
      setSaveError(
        error instanceof Error
          ? error.message
          : "Nao foi possivel salvar a reserva.",
      );
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!db || !window.confirm("Excluir esta reserva?")) {
      return;
    }

    await deleteDoc(doc(db, "reservations", id));
  }

  function startCreateForDate(dateKey: string) {
    setActiveView("schedule");
    setSelectedDate(dateKey);
    setEditingId(null);
    setFormData({ ...initialForm, date: dateKey });
  }

  function startEdit(reservation: Reservation) {
    setActiveView("schedule");
    setSelectedDate(reservation.date);
    setEditingId(reservation.id);
    setFormData({
      customerName: reservation.customerName,
      date: reservation.date,
      depositValue: reservation.depositValue,
      endTime: reservation.endTime,
      notes: reservation.notes,
      phone: reservation.phone,
      startTime: reservation.startTime,
      status: reservation.status,
      totalValue: reservation.totalValue,
    });
  }

  function changeMonth(direction: number) {
    setMonthDate(
      new Date(monthDate.getFullYear(), monthDate.getMonth() + direction, 1),
    );
  }

  function exportCsv() {
    const header = [
      "Data",
      "Inicio",
      "Fim",
      "Cliente",
      "Telefone",
      "Status",
      "Valor",
      "Sinal",
      "Observacoes",
    ];
    const rows = reservations.map((reservation) => [
      reservation.date,
      reservation.startTime,
      reservation.endTime,
      reservation.customerName,
      reservation.phone,
      statusLabels[reservation.status],
      reservation.totalValue,
      reservation.depositValue,
      reservation.notes,
    ]);
    const csv = [header, ...rows]
      .map((row) =>
        row
          .map((cell) => `"${String(cell).replaceAll('"', '""')}"`)
          .join(","),
      )
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `agenda-guaruja-${toDateKey(new Date())}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  }

  if (!isFirebaseConfigured) {
    return <SetupMissing />;
  }

  if (!authChecked) {
    return (
      <main className="grid min-h-screen place-items-center bg-[#f4f7f5] text-slate-900">
        <LoaderCircle className="h-8 w-8 animate-spin text-teal-700" />
      </main>
    );
  }

  if (!authUser) {
    return (
      <main className="min-h-screen bg-[#f4f7f5] px-4 py-8 text-slate-900 sm:px-6">
        <section className="mx-auto grid min-h-[calc(100vh-4rem)] w-full max-w-5xl items-center gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-teal-200 bg-white px-4 py-2 text-sm font-medium text-teal-800 shadow-sm">
              <CalendarDays className="h-4 w-4" />
              Area de Lazer Guaruja
            </div>
            <div className="space-y-4">
              <h1 className="max-w-2xl text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
                Agenda interna de reservas
              </h1>
              <p className="max-w-xl text-lg leading-8 text-slate-600">
                Controle datas, pagamentos e contatos em um painel privado para
                voce e seu pai.
              </p>
            </div>
          </div>

          <form
            onSubmit={handleLogin}
            className="rounded-[8px] border border-slate-200 bg-white p-6 shadow-sm"
          >
            <div className="mb-6 space-y-2">
              <h2 className="text-2xl font-semibold text-slate-950">Entrar</h2>
              <p className="text-sm text-slate-500">
                Use o e-mail criado no Firebase Authentication.
              </p>
            </div>
            <label className="mb-4 block">
              <span className="mb-2 block text-sm font-medium text-slate-700">
                E-mail
              </span>
              <input
                className="h-11 w-full rounded-[6px] border border-slate-300 px-3 text-base outline-none transition focus:border-teal-600 focus:ring-4 focus:ring-teal-100"
                inputMode="email"
                onChange={(event) => setEmail(event.target.value)}
                required
                type="email"
                value={email}
              />
            </label>
            <label className="mb-5 block">
              <span className="mb-2 block text-sm font-medium text-slate-700">
                Senha
              </span>
              <div className="relative">
                <input
                  className="h-11 w-full rounded-[6px] border border-slate-300 px-3 pr-11 text-base outline-none transition focus:border-teal-600 focus:ring-4 focus:ring-teal-100"
                  onChange={(event) => setPassword(event.target.value)}
                  required
                  type={showPassword ? "text" : "password"}
                  value={password}
                />
                <button
                  aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                  className="absolute right-1 top-1 grid h-9 w-9 place-items-center rounded-[6px] text-slate-500 transition hover:bg-slate-100 hover:text-slate-800"
                  onClick={() => setShowPassword((current) => !current)}
                  type="button"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </label>
            {authError ? (
              <p className="mb-4 rounded-[6px] border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-800">
                {authError}
              </p>
            ) : null}
            <button
              className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-[6px] bg-teal-700 px-4 text-sm font-semibold text-white transition hover:bg-teal-800 disabled:cursor-not-allowed disabled:bg-slate-300"
              disabled={isSigningIn}
              type="submit"
            >
              {isSigningIn ? (
                <LoaderCircle className="h-4 w-4 animate-spin" />
              ) : (
                <UserRound className="h-4 w-4" />
              )}
              Acessar agenda
            </button>
          </form>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f4f7f5] text-slate-900">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-5 sm:px-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm font-medium text-teal-700">
              Area de Lazer Guaruja
            </p>
            <h1 className="text-2xl font-semibold tracking-tight text-slate-950">
              {activeView === "dashboard" ? "Dashboard" : "Agenda de reservas"}
            </h1>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button
              className={[
                "inline-flex h-10 items-center gap-2 rounded-[6px] border px-3 text-sm font-medium transition",
                activeView === "dashboard"
                  ? "border-teal-700 bg-teal-700 text-white"
                  : "border-slate-300 bg-white text-slate-700 hover:bg-slate-50",
              ].join(" ")}
              onClick={() => setActiveView("dashboard")}
              type="button"
            >
              <BarChart3 className="h-4 w-4" />
              Dashboard
            </button>
            <button
              className={[
                "inline-flex h-10 items-center gap-2 rounded-[6px] border px-3 text-sm font-medium transition",
                activeView === "schedule"
                  ? "border-teal-700 bg-teal-700 text-white"
                  : "border-slate-300 bg-white text-slate-700 hover:bg-slate-50",
              ].join(" ")}
              onClick={() => setActiveView("schedule")}
              type="button"
            >
              <CalendarDays className="h-4 w-4" />
              Agenda
            </button>
            <button
              className="inline-flex h-10 items-center gap-2 rounded-[6px] border border-slate-300 bg-white px-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
              onClick={exportCsv}
              type="button"
            >
              <Download className="h-4 w-4" />
              Exportar CSV
            </button>
            <button
              className="inline-flex h-10 items-center gap-2 rounded-[6px] border border-slate-300 bg-white px-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
              onClick={() => auth && signOut(auth)}
              type="button"
            >
              <LogOut className="h-4 w-4" />
              Sair
            </button>
          </div>
        </div>
      </header>

      {activeView === "dashboard" ? (
        <DashboardView
          monthDate={monthDate}
          monthSummary={monthSummary}
          onChangeMonth={changeMonth}
          onCreateReservation={() => startCreateForDate(toDateKey(new Date()))}
          onOpenSchedule={() => setActiveView("schedule")}
          onSetMonth={(value) => {
            const [year, month] = value.split("-").map(Number);
            setMonthDate(new Date(year, month - 1, 1));
          }}
          onSelectReservation={startEdit}
          reservations={reservations}
          upcomingReservations={upcomingReservations}
        />
      ) : (
      <section className="mx-auto grid max-w-7xl gap-4 px-4 py-5 sm:px-6 lg:grid-cols-[1.4fr_0.9fr]">
        <div className="space-y-4">
          <div className="grid gap-3 sm:grid-cols-3">
            <Metric
              icon={<CalendarDays className="h-4 w-4" />}
              label="Reservas no mes"
              value={String(monthSummary.reservations)}
            />
            <Metric
              icon={<WalletCards className="h-4 w-4" />}
              label="Sinais recebidos"
              value={currency(monthSummary.received)}
            />
            <Metric
              icon={<WalletCards className="h-4 w-4" />}
              label="Total previsto"
              value={currency(monthSummary.expected)}
            />
          </div>

          <section className="rounded-[8px] border border-slate-200 bg-white p-4 shadow-sm">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-xl font-semibold text-slate-950">
                  {monthNames[monthDate.getMonth()]} {monthDate.getFullYear()}
                </h2>
                <p className="text-sm text-slate-500">
                  {`${reservations.length} registro(s) neste mes`}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  aria-label="Mes anterior"
                  className="grid h-10 w-10 place-items-center rounded-[6px] border border-slate-300 text-slate-700 transition hover:bg-slate-50"
                  onClick={() => changeMonth(-1)}
                  type="button"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button
                  aria-label="Proximo mes"
                  className="grid h-10 w-10 place-items-center rounded-[6px] border border-slate-300 text-slate-700 transition hover:bg-slate-50"
                  onClick={() => changeMonth(1)}
                  type="button"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-7 gap-1 text-center text-xs font-semibold uppercase text-slate-500">
              {weekdayNames.map((weekday) => (
                <div key={weekday} className="py-2">
                  {weekday}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-1">
              {calendarDays.map((day) => {
                const count = reservationCountByDate[day.dateKey] || 0;
                const isSelected = selectedDate === day.dateKey;

                return (
                  <button
                    className={[
                      "min-h-24 rounded-[6px] border p-2 text-left transition",
                      day.isCurrentMonth
                        ? "border-slate-200 bg-white hover:border-teal-400"
                        : "border-slate-100 bg-slate-50 text-slate-400",
                      isSelected ? "border-teal-600 ring-2 ring-teal-100" : "",
                    ].join(" ")}
                    key={day.dateKey}
                    onClick={() => startCreateForDate(day.dateKey)}
                    type="button"
                  >
                    <div className="flex items-center justify-between">
                      <span
                        className={[
                          "grid h-7 w-7 place-items-center rounded-full text-sm font-semibold",
                          day.isToday
                            ? "bg-teal-700 text-white"
                            : "text-slate-800",
                        ].join(" ")}
                      >
                        {day.date.getDate()}
                      </span>
                      {count ? (
                        <span className="rounded-full bg-slate-900 px-2 py-0.5 text-xs font-semibold text-white">
                          {count}
                        </span>
                      ) : null}
                    </div>
                    {count ? (
                      <p className="mt-3 truncate text-xs font-medium text-teal-800">
                        {count === 1 ? "1 reserva" : `${count} reservas`}
                      </p>
                    ) : null}
                  </button>
                );
              })}
            </div>
          </section>

          <section className="rounded-[8px] border border-slate-200 bg-white p-4 shadow-sm">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-xl font-semibold text-slate-950">
                  {formatFullDate(selectedDate)}
                </h2>
                <p className="text-sm text-slate-500">
                  {selectedReservations.length
                    ? `${selectedReservations.length} reserva(s)`
                    : "Nenhuma reserva neste dia"}
                </p>
              </div>
              <button
                className="inline-flex h-10 items-center gap-2 rounded-[6px] bg-teal-700 px-3 text-sm font-semibold text-white transition hover:bg-teal-800"
                onClick={() => startCreateForDate(selectedDate)}
                type="button"
              >
                <Plus className="h-4 w-4" />
                Nova reserva
              </button>
            </div>

            <div className="space-y-3">
              {selectedReservations.map((reservation) => (
                <article
                  className="rounded-[8px] border border-slate-200 p-4"
                  key={reservation.id}
                >
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div className="space-y-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-lg font-semibold text-slate-950">
                          {reservation.customerName}
                        </h3>
                        <span
                          className={`rounded-full border px-2.5 py-1 text-xs font-semibold ${statusClasses[reservation.status]}`}
                        >
                          {statusLabels[reservation.status]}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-slate-600">
                        <span className="inline-flex items-center gap-1.5">
                          <Clock className="h-4 w-4" />
                          {reservation.startTime} - {reservation.endTime}
                        </span>
                        <span className="inline-flex items-center gap-1.5">
                          <Phone className="h-4 w-4" />
                          {reservation.phone || "Sem telefone"}
                        </span>
                        <span className="inline-flex items-center gap-1.5">
                          <WalletCards className="h-4 w-4" />
                          {currency(reservation.depositValue)} /{" "}
                          {currency(reservation.totalValue)}
                        </span>
                      </div>
                      {reservation.notes ? (
                        <p className="text-sm leading-6 text-slate-600">
                          {reservation.notes}
                        </p>
                      ) : null}
                    </div>
                    <div className="flex gap-2">
                      <button
                        aria-label="Editar reserva"
                        className="grid h-9 w-9 place-items-center rounded-[6px] border border-slate-300 text-slate-700 transition hover:bg-slate-50"
                        onClick={() => startEdit(reservation)}
                        type="button"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        aria-label="Excluir reserva"
                        className="grid h-9 w-9 place-items-center rounded-[6px] border border-rose-200 text-rose-700 transition hover:bg-rose-50"
                        onClick={() => handleDelete(reservation.id)}
                        type="button"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>
        </div>

        <aside className="lg:sticky lg:top-5 lg:self-start">
          <form
            className="rounded-[8px] border border-slate-200 bg-white p-4 shadow-sm"
            onSubmit={handleSave}
          >
            <div className="mb-5 flex items-start justify-between gap-3">
              <div>
                <h2 className="text-xl font-semibold text-slate-950">
                  {editingId ? "Editar reserva" : "Nova reserva"}
                </h2>
                <p className="text-sm text-slate-500">
                  {formatShortDate(formData.date)}
                </p>
              </div>
              {editingId ? (
                <button
                  aria-label="Cancelar edicao"
                  className="grid h-9 w-9 place-items-center rounded-[6px] border border-slate-300 text-slate-700 transition hover:bg-slate-50"
                  onClick={() => {
                    setEditingId(null);
                    setFormData({ ...initialForm, date: selectedDate });
                  }}
                  type="button"
                >
                  <X className="h-4 w-4" />
                </button>
              ) : null}
            </div>

            <div className="space-y-4">
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-slate-700">
                  Cliente
                </span>
                <input
                  className="h-10 w-full rounded-[6px] border border-slate-300 px-3 text-sm outline-none transition focus:border-teal-600 focus:ring-4 focus:ring-teal-100"
                  onChange={(event) =>
                    setFormData({ ...formData, customerName: event.target.value })
                  }
                  required
                  value={formData.customerName}
                />
              </label>

              <div className="grid gap-3 sm:grid-cols-2">
                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-slate-700">
                    Data
                  </span>
                  <input
                    className="h-10 w-full rounded-[6px] border border-slate-300 px-3 text-sm outline-none transition focus:border-teal-600 focus:ring-4 focus:ring-teal-100"
                    onChange={(event) => {
                      setSelectedDate(event.target.value);
                      setFormData({ ...formData, date: event.target.value });
                    }}
                    required
                    type="date"
                    value={formData.date}
                  />
                </label>
                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-slate-700">
                    Status
                  </span>
                  <select
                    className="h-10 w-full rounded-[6px] border border-slate-300 px-3 text-sm outline-none transition focus:border-teal-600 focus:ring-4 focus:ring-teal-100"
                    onChange={(event) =>
                      setFormData({
                        ...formData,
                        status: event.target.value as ReservationStatus,
                      })
                    }
                    value={formData.status}
                  >
                    {Object.entries(statusLabels).map(([status, label]) => (
                      <option key={status} value={status}>
                        {label}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-slate-700">
                    Inicio
                  </span>
                  <input
                    className="h-10 w-full rounded-[6px] border border-slate-300 px-3 text-sm outline-none transition focus:border-teal-600 focus:ring-4 focus:ring-teal-100"
                    onChange={(event) =>
                      setFormData({ ...formData, startTime: event.target.value })
                    }
                    required
                    type="time"
                    value={formData.startTime}
                  />
                </label>
                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-slate-700">
                    Fim
                  </span>
                  <input
                    className="h-10 w-full rounded-[6px] border border-slate-300 px-3 text-sm outline-none transition focus:border-teal-600 focus:ring-4 focus:ring-teal-100"
                    onChange={(event) =>
                      setFormData({ ...formData, endTime: event.target.value })
                    }
                    required
                    type="time"
                    value={formData.endTime}
                  />
                </label>
              </div>

              <label className="block">
                <span className="mb-2 block text-sm font-medium text-slate-700">
                  Telefone
                </span>
                <input
                  className="h-10 w-full rounded-[6px] border border-slate-300 px-3 text-sm outline-none transition focus:border-teal-600 focus:ring-4 focus:ring-teal-100"
                  inputMode="tel"
                  onChange={(event) =>
                    setFormData({ ...formData, phone: event.target.value })
                  }
                  value={formData.phone}
                />
              </label>

              <div className="grid gap-3 sm:grid-cols-2">
                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-slate-700">
                    Valor total
                  </span>
                  <input
                    className="h-10 w-full rounded-[6px] border border-slate-300 px-3 text-sm outline-none transition focus:border-teal-600 focus:ring-4 focus:ring-teal-100"
                    min="0"
                    onChange={(event) =>
                      setFormData({
                        ...formData,
                        totalValue: Number(event.target.value),
                      })
                    }
                    step="0.01"
                    type="number"
                    value={formData.totalValue}
                  />
                </label>
                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-slate-700">
                    Sinal
                  </span>
                  <input
                    className="h-10 w-full rounded-[6px] border border-slate-300 px-3 text-sm outline-none transition focus:border-teal-600 focus:ring-4 focus:ring-teal-100"
                    min="0"
                    onChange={(event) =>
                      setFormData({
                        ...formData,
                        depositValue: Number(event.target.value),
                      })
                    }
                    step="0.01"
                    type="number"
                    value={formData.depositValue}
                  />
                </label>
              </div>

              <label className="block">
                <span className="mb-2 block text-sm font-medium text-slate-700">
                  Observacoes
                </span>
                <textarea
                  className="min-h-24 w-full resize-y rounded-[6px] border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-teal-600 focus:ring-4 focus:ring-teal-100"
                  onChange={(event) =>
                    setFormData({ ...formData, notes: event.target.value })
                  }
                  value={formData.notes}
                />
              </label>
            </div>

            {saveError ? (
              <p className="mt-4 rounded-[6px] border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-800">
                {saveError}
              </p>
            ) : null}

            <button
              className="mt-5 inline-flex h-11 w-full items-center justify-center gap-2 rounded-[6px] bg-teal-700 px-4 text-sm font-semibold text-white transition hover:bg-teal-800 disabled:cursor-not-allowed disabled:bg-slate-300"
              disabled={isSaving}
              type="submit"
            >
              {isSaving ? (
                <LoaderCircle className="h-4 w-4 animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              {editingId ? "Salvar alteracoes" : "Salvar reserva"}
            </button>
          </form>
        </aside>
      </section>
      )}
    </main>
  );
}

function DashboardView({
  monthDate,
  monthSummary,
  onChangeMonth,
  onCreateReservation,
  onOpenSchedule,
  onSetMonth,
  onSelectReservation,
  reservations,
  upcomingReservations,
}: {
  monthDate: Date;
  monthSummary: {
    expected: number;
    received: number;
    reservations: number;
  };
  onChangeMonth: (direction: number) => void;
  onCreateReservation: () => void;
  onOpenSchedule: () => void;
  onSetMonth: (value: string) => void;
  onSelectReservation: (reservation: Reservation) => void;
  reservations: Reservation[];
  upcomingReservations: Reservation[];
}) {
  const activeReservations = reservations.filter(
    (reservation) => reservation.status !== "cancelado",
  );
  const occupiedDays = new Set(
    activeReservations.map((reservation) => reservation.date),
  ).size;
  const pendingValue = Math.max(monthSummary.expected - monthSummary.received, 0);
  const paidReservations = activeReservations.filter(
    (reservation) => reservation.status === "pago",
  ).length;

  return (
    <section className="mx-auto max-w-7xl px-4 py-5 sm:px-6">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">
            {monthNames[monthDate.getMonth()]} {monthDate.getFullYear()}
          </p>
          <h2 className="text-2xl font-semibold tracking-tight text-slate-950">
            Visao geral do mes
          </h2>
        </div>
        <div className="flex flex-wrap gap-2">
          <div className="flex items-center gap-2 rounded-[6px] border border-slate-300 bg-white p-1">
            <button
              aria-label="Mes anterior"
              className="grid h-8 w-8 place-items-center rounded-[5px] text-slate-700 transition hover:bg-slate-50"
              onClick={() => onChangeMonth(-1)}
              type="button"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <input
              aria-label="Selecionar mes"
              className="h-8 min-w-34 border-0 bg-transparent px-2 text-sm font-medium text-slate-700 outline-none"
              onChange={(event) => onSetMonth(event.target.value)}
              type="month"
              value={toMonthInputValue(monthDate)}
            />
            <button
              aria-label="Proximo mes"
              className="grid h-8 w-8 place-items-center rounded-[5px] text-slate-700 transition hover:bg-slate-50"
              onClick={() => onChangeMonth(1)}
              type="button"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
          <button
            className="inline-flex h-10 items-center gap-2 rounded-[6px] border border-slate-300 bg-white px-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
            onClick={onOpenSchedule}
            type="button"
          >
            <CalendarDays className="h-4 w-4" />
            Abrir agenda
          </button>
          <button
            className="inline-flex h-10 items-center gap-2 rounded-[6px] bg-teal-700 px-3 text-sm font-semibold text-white transition hover:bg-teal-800"
            onClick={onCreateReservation}
            type="button"
          >
            <Plus className="h-4 w-4" />
            Nova reserva
          </button>
        </div>
      </div>

      <div className="mb-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <Metric
          icon={<CalendarDays className="h-4 w-4" />}
          label="Reservas no mes"
          value={String(monthSummary.reservations)}
        />
        <Metric
          icon={<WalletCards className="h-4 w-4" />}
          label="Sinais recebidos"
          value={currency(monthSummary.received)}
        />
        <Metric
          icon={<WalletCards className="h-4 w-4" />}
          label="Total previsto"
          value={currency(monthSummary.expected)}
        />
        <Metric
          icon={<WalletCards className="h-4 w-4" />}
          label="Saldo a receber"
          value={currency(pendingValue)}
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
        <section className="rounded-[8px] border border-slate-200 bg-white p-4 shadow-sm">
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-slate-950">
              Indicadores
            </h3>
            <p className="text-sm text-slate-500">
              {activeReservations.length} reserva(s) ativa(s)
            </p>
          </div>

          <div className="divide-y divide-slate-200">
            <DashboardLine label="Dias ocupados" value={String(occupiedDays)} />
            <DashboardLine label="Pagas" value={String(paidReservations)} />
            <DashboardLine
              label="Canceladas"
              value={String(
                reservations.filter(
                  (reservation) => reservation.status === "cancelado",
                ).length,
              )}
            />
            <DashboardLine
              label="Ticket medio"
              value={currency(
                activeReservations.length
                  ? monthSummary.expected / activeReservations.length
                  : 0,
              )}
            />
          </div>
        </section>

        <section className="rounded-[8px] border border-slate-200 bg-white p-4 shadow-sm">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <h3 className="text-lg font-semibold text-slate-950">
                Proximas reservas
              </h3>
              <p className="text-sm text-slate-500">
                {upcomingReservations.length
                  ? `${upcomingReservations.length} agendamento(s)`
                  : "Nenhum agendamento futuro neste mes"}
              </p>
            </div>
            <button
              aria-label="Abrir agenda"
              className="grid h-9 w-9 place-items-center rounded-[6px] border border-slate-300 text-slate-700 transition hover:bg-slate-50"
              onClick={onOpenSchedule}
              type="button"
            >
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>

          <div className="divide-y divide-slate-200">
            {upcomingReservations.map((reservation) => (
              <button
                className="flex w-full flex-col gap-2 py-3 text-left transition hover:bg-slate-50 sm:flex-row sm:items-center sm:justify-between"
                key={reservation.id}
                onClick={() => onSelectReservation(reservation)}
                type="button"
              >
                <div>
                  <p className="font-semibold text-slate-950">
                    {reservation.customerName}
                  </p>
                  <p className="text-sm text-slate-500">
                    {formatShortDate(reservation.date)} - {reservation.startTime}{" "}
                    ate {reservation.endTime}
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-2 sm:justify-end">
                  <span
                    className={`rounded-full border px-2.5 py-1 text-xs font-semibold ${statusClasses[reservation.status]}`}
                  >
                    {statusLabels[reservation.status]}
                  </span>
                  <span className="text-sm font-semibold text-slate-700">
                    {currency(reservation.totalValue)}
                  </span>
                </div>
              </button>
            ))}
            {!upcomingReservations.length ? (
              <div className="py-8 text-sm text-slate-500">
                Nenhuma reserva futura cadastrada neste mes.
              </div>
            ) : null}
          </div>
        </section>
      </div>
    </section>
  );
}

function DashboardLine({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3 py-3">
      <span className="text-sm font-medium text-slate-500">{label}</span>
      <span className="text-base font-semibold text-slate-950">{value}</span>
    </div>
  );
}

function Metric({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-[8px] border border-slate-200 bg-white p-4 shadow-sm">
      <div className="mb-3 inline-grid h-9 w-9 place-items-center rounded-[6px] bg-teal-50 text-teal-700">
        {icon}
      </div>
      <p className="text-sm font-medium text-slate-500">{label}</p>
      <p className="mt-1 text-2xl font-semibold text-slate-950">{value}</p>
    </div>
  );
}

function SetupMissing() {
  return (
    <main className="min-h-screen bg-[#f4f7f5] px-4 py-8 text-slate-900 sm:px-6">
      <section className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-3xl items-center">
        <div className="rounded-[8px] border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-4 inline-grid h-11 w-11 place-items-center rounded-[6px] bg-teal-50 text-teal-700">
            <CalendarDays className="h-5 w-5" />
          </div>
          <h1 className="text-2xl font-semibold text-slate-950">
            Configure o Firebase
          </h1>
          <p className="mt-3 leading-7 text-slate-600">
            Crie um arquivo <code className="font-mono">.env.local</code> com as
            chaves do projeto Firebase. Use o arquivo{" "}
            <code className="font-mono">.env.example</code> como referencia.
          </p>
        </div>
      </section>
    </main>
  );
}
