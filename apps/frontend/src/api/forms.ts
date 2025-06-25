export async function savePreTest(answers: (string | number)[], userId: string) {
  await fetch("/api/forms/pre-test", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId, answers }),
  });
}

export async function savePostTest(answers: (string | number)[], userId: string) {
  await fetch("/api/forms/post-test", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId, answers }),
  });
}