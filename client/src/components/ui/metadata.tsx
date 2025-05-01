import { Helmet } from 'react-helmet';

interface MetadataProps {
  title: string;
  description: string;
}

export function Metadata({ title, description }: MetadataProps) {
  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
    </Helmet>
  );
}