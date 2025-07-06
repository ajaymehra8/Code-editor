// app/update-snippet/[id]/page.tsx
import UpdateSnippet from './UpdateSnippet';

export default function UpdateSnippetPage({ params }: { params: { id: string } }) {
  return <UpdateSnippet id={params.id} />;
}
