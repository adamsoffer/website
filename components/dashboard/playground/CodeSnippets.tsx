"use client";

import { useState } from "react";
import CopyButton from "@/components/dashboard/CopyButton";
import type { Model } from "@/lib/dashboard/types";

type Lang = "curl" | "python" | "node" | "http";

const LANGS: { key: Lang; label: string }[] = [
  { key: "curl", label: "cURL" },
  { key: "python", label: "Python" },
  { key: "node", label: "Node.js" },
  { key: "http", label: "HTTP" },
];

function generateSnippets(
  model: Model,
  runValues?: Record<string, unknown>,
): Record<Lang, string> {
  const baseUrl = model.apiEndpoint ?? "https://gateway.livepeer.org/v1";
  const endpoint =
    model.category === "Language"
      ? `${baseUrl}/chat/completions`
      : `${baseUrl}/${model.id}`;

  const isLLM = model.category === "Language";

  // If the user has supplied playground inputs, bake them into the request body
  // so "Copy code for this run" produces production code matching what they tested.
  const useRunValues = runValues && Object.keys(runValues).length > 0;

  let body: string;
  if (useRunValues) {
    const payload = isLLM
      ? { model: model.id, ...runValues }
      : { ...runValues, model: model.id };
    body = JSON.stringify(payload, null, 2);
  } else {
    body = isLLM
      ? `{
    "model": "${model.id}",
    "messages": [
      {"role": "user", "content": "Hello, how are you?"}
    ],
    "temperature": 0.7,
    "max_tokens": 1024
  }`
      : `{
    "prompt": "A scenic mountain landscape at sunset",
    "model": "${model.id}"
  }`;
  }

  return {
    curl: `curl -X POST "${endpoint}" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '${body}'`,

    python: useRunValues
      ? `import requests

response = requests.post(
    "${endpoint}",
    headers={
        "Authorization": "Bearer YOUR_API_KEY",
        "Content-Type": "application/json",
    },
    json=${body.replace(/^/gm, "    ").trimStart()},
)
print(response.json())`
      : isLLM
        ? `from openai import OpenAI

client = OpenAI(
    base_url="${baseUrl}",
    api_key="YOUR_API_KEY",
)

response = client.chat.completions.create(
    model="${model.id}",
    messages=[
        {"role": "user", "content": "Hello, how are you?"}
    ],
    temperature=0.7,
    max_tokens=1024,
)
print(response.choices[0].message.content)`
        : `import requests

response = requests.post(
    "${endpoint}",
    headers={
        "Authorization": "Bearer YOUR_API_KEY",
        "Content-Type": "application/json",
    },
    json={
        "prompt": "A scenic mountain landscape at sunset",
        "model": "${model.id}",
    },
)
print(response.json())`,

    node: useRunValues
      ? `const response = await fetch("${endpoint}", {
  method: "POST",
  headers: {
    Authorization: "Bearer YOUR_API_KEY",
    "Content-Type": "application/json",
  },
  body: JSON.stringify(${body.replace(/^/gm, "  ").trimStart()}),
});
const result = await response.json();
console.log(result);`
      : isLLM
        ? `import OpenAI from "openai";

const client = new OpenAI({
  baseURL: "${baseUrl}",
  apiKey: "YOUR_API_KEY",
});

const response = await client.chat.completions.create({
  model: "${model.id}",
  messages: [
    { role: "user", content: "Hello, how are you?" },
  ],
  temperature: 0.7,
  max_tokens: 1024,
});
console.log(response.choices[0].message.content);`
        : `const response = await fetch("${endpoint}", {
  method: "POST",
  headers: {
    Authorization: "Bearer YOUR_API_KEY",
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    prompt: "A scenic mountain landscape at sunset",
    model: "${model.id}",
  }),
});
const result = await response.json();
console.log(result);`,

    http: `POST ${endpoint} HTTP/1.1
Host: ${new URL(baseUrl).host}
Authorization: Bearer YOUR_API_KEY
Content-Type: application/json

${body}`,
  };
}

export default function CodeSnippets({
  model,
  fixedLang,
  runValues,
}: {
  model: Model;
  fixedLang?: Lang;
  /** When provided, snippets bake these values into the request body instead of
   *  the generic example. Used by the Playground's "Copy code for this run". */
  runValues?: Record<string, unknown>;
}) {
  const [lang, setLang] = useState<Lang>(fixedLang ?? "curl");
  const snippets = generateSnippets(model, runValues);
  const activeLang = fixedLang ?? lang;

  return (
    <div className="overflow-hidden rounded-lg border border-hairline">
      <div className="flex items-center justify-between border-b border-hairline bg-white/[0.02]">
        {fixedLang ? (
          <span className="px-3 py-2 text-xs font-medium text-fg-faint">
            {LANGS.find((l) => l.key === fixedLang)?.label}
          </span>
        ) : (
          <div className="flex">
            {LANGS.map((l) => (
              <button
                key={l.key}
                onClick={() => setLang(l.key)}
                className={`border-b-2 px-3 py-2 text-xs font-medium transition-colors ${
                  lang === l.key
                    ? "border-green-bright text-white"
                    : "border-transparent text-fg-faint hover:text-fg-muted"
                }`}
              >
                {l.label}
              </button>
            ))}
          </div>
        )}
        <CopyButton
          value={snippets[activeLang]}
          label="Copy"
          ariaLabel="Copy code"
          className="mr-2"
        />
      </div>
      <pre className="scrollbar-dark overflow-x-auto bg-black/40 p-4 font-mono text-xs leading-relaxed text-fg-muted">
        {snippets[activeLang]}
      </pre>
    </div>
  );
}
