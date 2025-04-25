import { RavenMatrixPage } from "@/pages/RavenMatrixPage.tsx";
import { JSX, useState } from "react";

enum Page {
  RAVEN_MATRIX,
  END,
}

export default function App(): JSX.Element {
  const [protocol] = useState<string>("control");
  const [page, setPage] = useState<Page>(Page.RAVEN_MATRIX);

  switch (page) {
    case Page.RAVEN_MATRIX:
      return <RavenMatrixPage protocol={protocol} goToNextPage={() => setPage(Page.END)}/>;
    case Page.END:
      return <span>Thanks!</span>;
  }
}
