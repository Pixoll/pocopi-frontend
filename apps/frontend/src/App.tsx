import { RavenMatrixPage } from "@/pages/RavenMatrixPage.tsx";
import { config } from "@pocopi/config";
import { JSX, useState } from "react";

enum Page {
  RAVEN_MATRIX,
  END,
}

export default function App(): JSX.Element {
  const [group] = useState(config.sampleGroup());
  const [page, setPage] = useState<Page>(Page.RAVEN_MATRIX);

  switch (page) {
    case Page.RAVEN_MATRIX:
      return <RavenMatrixPage group={group} goToNextPage={() => setPage(Page.END)}/>;
    case Page.END:
      return <span>Thanks!</span>;
  }
}
