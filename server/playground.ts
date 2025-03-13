import type { TDocumentQuery } from "./documents/index.ts";
import type { TDocument } from "./extensions/index.ts";

const API_URL = "http://localhost:8080/api/v1";
const TOKEN =
  "eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCIsInN1YiI6Im1haWxAYW5nYWQuZGV2IiwiZXhwIjoxNzQyNDc4Mzk2LCJpYXQiOjE3NDE4NzM1OTZ9.eyJpZCI6ImIyZTI3YzAzLWY5MWQtNDRjZC05MDM3LTZjMzAwZWRjYTQ4ZSIsImVtYWlsIjoibWFpbEBhbmdhZC5kZXYiLCJuYW1lIjoiQW5nYWQgU2luZ2giLCJnb29nbGVfaWQiOiIxMDU2MzU3NjA3OTI3MDEwMzY1MzYiLCJwaWN0dXJlIjoiaHR0cHM6Ly9saDMuZ29vZ2xldXNlcmNvbnRlbnQuY29tL2EtL0FMVi1ValZVdFNHaGZqQ2IwQkhKVko1MUcyNWNKaDV2QS1nQk8wenhyRi0zQlVRSlFveWo2TGJfUUFqTDJlclluN0lIQ2JpMlhlTHEyVHJDcVhhazFDU1RRck4xOWozX0NON0hSOWY4YkRlZV9ac1dzS0NvNHZrdkc0VGQtclQ2SG5NSmFBN1llVnZMY3lGRzNIZ21VNElBNndWN0llYjc1SjctVW04MWpjQjQyZ2FzbXFYUzBndnNtc3JsVlBwb1pjeTlFMDdjTTFLNGM1dzBDQUJYaUd0Y29UN3p1T1RHVm4xUDN2M0RsZkRXMHB2VTlKbGljRl9HVXpUbExRSDB2Y2RENl82dkFqbWJiU3I2VHo5cjIwLTVXN1NVVjFaMWpycTlBMVRsV09LWHBpM1I0RzN1UmRQRUFaQ0RvWUV1V0Z4b0hBUEg0akZYVXJDYUhCSzlxVEZKZ2pfRGQwVU1ja0J5UjAxYlpaQlBwTjF6bEpEZWdlWDJ3TnZrd1V6Q0lpdGVqUS1FamNkMnZZR05ienExWEM0ajUyRV9JTmJFSUY3M0hDbHZnNjFzTXktZVNrUk1ScFZXZ3JpQmMwUUJiVDBtOUdZV1dnVThwWi1UY2x3M0s4Q2hNMGg3TEtEeVA1bnJ6WHpmTllPU1JMTS1HTnVlOEFBLWpZNUFOZ2g3RUJLZE43Sll0U0EyN045WnJKbS0zWjRleGtRb003b0sxX20yOTEyalo2STdkR0t2MWRHcFdzT3RUQ1FTR3VoWUtoakR6dkc0LXNCMVpHbGkwSnFJbXRueTRMbmFZYnItNnkyejhRVWE2V2NrUmlMVWtubHV0ZkxoM0hXaWhhZ2g2V0ZGNjRqYm15Y0R2RGhtOHRBenAtMjJtTFBIeDhDUURiTWM0ZFJheklqZmY4d3Z3c2wyUFlVMlFoTVpwMzF6cWlKRTIxMUNTMGdHT3hXX211bko1N3lTdXN1SHNLNzNPTnVBYWFwRlp1SjBjQ0lHM2N5MExUNHFyOUh2NkNKMFlPZElQUUFvdm5JMHNVX2lKS2NvWHB4SGdKeks2NllsYnBFZjZRRUFHd2M4eldzZlU1RVRJNFgzVTVQOFlQbTF2V0dHd0lxWmZfU3BMT2RnZE9RLWxqeEVfdjhKWXlBS1k1UEEtWmw4REhjRk90a3hRdDMyR25IQUFjQWxLbE5rMVBGR25YUWwwT0VLeVNLelo2TDlkZWUtSjhuaDNWejIwMmdNSVllRHJLZnQxN3VSMjZnc3h6a2w5YjdZN2hSNkplajVTWWl2cTBJdFlaQWgydC16cnJTQVA2WWQ2RUE9czk2LWMifQ.i6s3cOLsu8qmgg9Vf31W2zs3W4YDn-XXafbTvfcd61GZDQcrGB4xg051_EF0JRSdw9LmgxG0lubg6QcSpVat3A";

const healthCheck = async () => {
  const response = await fetch(`${API_URL}/healthcheck/`);
  console.log(await response.json());
};

await healthCheck();

const queryDocuments = async (query: TDocumentQuery) => {
  const response = await fetch(`${API_URL}/documents/query/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${TOKEN}`,
    },
    body: JSON.stringify({ query }),
  });
  console.log(await response.json());
};

const createDocument = async (
  document: Omit<
    TDocument<unknown>,
    "userId" | "id" | "createdAt" | "updatedAt"
  >,
) => {
  const response = await fetch(
    `${API_URL}/documents/create/${document.extension}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${TOKEN}`,
      },
      body: JSON.stringify({ document }),
    },
  );

  return await response.json();
};

const document = await createDocument({
  title: "Test Document",
  content: { test: "related to hello" },
  extension: "notes",
});

console.log(document);

const documents = await queryDocuments({
  extensions: ["notes"],
  orderBy: "created_at",
  order: "desc",
});

console.log(documents);
