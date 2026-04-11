"use client";

import { useState } from "react";

export default function TestJoinPage() {
  const [result, setResult] = useState("");

  const tournamentId = "cmmuyljrd000264wy0sgbxrl3";
  const matchId = "AQUI_PON_UN_MATCH_ID_REAL";
  const winnerId = "AQUI_PON_UN_USER_ID_REAL";

  async function callApi(
    url: string,
    method: string,
    body?: Record<string, unknown>
  ) {
    try {
      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: body ? JSON.stringify(body) : undefined,
      });

      const data = await res.json();
      setResult(JSON.stringify(data, null, 2));
    } catch (error) {
      console.error(error);
      setResult("Error al hacer la petición");
    }
  }

  return (
    <main style={{ padding: "24px" }}>
      <h1>Pruebas API</h1>

      <div style={{ display: "grid", gap: "10px", marginTop: "20px" }}>
        <button onClick={() => callApi("/api/tournaments", "GET")}>
          Ver torneos
        </button>

        <button
          onClick={() => callApi(`/api/tournaments/${tournamentId}`, "GET")}
        >
          Ver torneo por ID
        </button>

        <button
          onClick={() =>
            callApi(`/api/tournaments/${tournamentId}/participants`, "GET")
          }
        >
          Ver participantes
        </button>

        <button
          onClick={() =>
            callApi(`/api/tournaments/${tournamentId}/join-status`, "GET")
          }
        >
          Ver join-status
        </button>

        <button
          onClick={() =>
            callApi(`/api/tournaments/${tournamentId}/join`, "POST")
          }
        >
          Unirme al torneo
        </button>

        <button
          onClick={() =>
            callApi(`/api/tournaments/${tournamentId}/join`, "DELETE")
          }
        >
          Salirme del torneo
        </button>

        <button
          onClick={() =>
            callApi(`/api/tournaments/${tournamentId}`, "PATCH", {
              title: "Torneo editado prueba",
              maxPlayers: 20,
            })
          }
        >
          Editar torneo
        </button>

        <button onClick={() => callApi("/api/player-profile/me", "GET")}>
          Ver mi perfil
        </button>

        <button
          onClick={() =>
            callApi("/api/player-profile/me", "PATCH", {
              fullName: "Carlos Test",
              gamerTag: "TestUser",
            })
          }
        >
          Editar perfil
        </button>

        <button onClick={() => callApi("/api/my-tournaments", "GET")}>
          Ver mis torneos
        </button>

        <button
          onClick={() =>
            callApi(`/api/tournaments/${tournamentId}/matches/generate`, "POST")
          }
        >
          Generar matches
        </button>

        <button
          onClick={() => callApi(`/api/tournaments/${tournamentId}/matches`, "GET")}
        >
          Ver matches
        </button>

        <button
          onClick={() =>
            callApi(`/api/matches/${matchId}/result`, "POST", {
              winnerId,
              score: "2-1",
            })
          }
        >
          Registrar resultado
        </button>
      </div>

      <pre
        style={{
          marginTop: "20px",
          padding: "10px",
          background: "#111",
          color: "#0f0",
          whiteSpace: "pre-wrap",
        }}
      >
        {result}
      </pre>
    </main>
  );
}