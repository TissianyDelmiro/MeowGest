import { redirect } from "next/navigation";

export default function Home() {
  // O middleware já garante a sessão antes de chegar aqui.
  // Esta página só existe pra dar um destino padrão em "/".
  redirect("/gatos");
}
