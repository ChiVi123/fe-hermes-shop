export default async function ProductDetailsPage({ params }: { params: Promise<{ slugify: string }> }) {
  const { slugify } = await params;
  // const result = await apiClient.get(`/v1/products/${slugify}`).fetchError().json<Product>();

  // if (result instanceof FetchClientError) {
  //   return <div className='px-10 mt-12'>{result.json?.message}</div>;
  // }
  // if (result instanceof Error) {
  //   return <div className='px-10 mt-12'>{result.message}</div>;
  // }

  return (
    <>
      <section className='grid grid-cols-12 gap-14 w-full px-10 mt-12'>
        <p className='text-2xl text-red-500'> {slugify}</p>
      </section>

      <section className='px-10 mt-12'>
        {/* <Accordion type='single' collapsible className='w-full'>
          {result.attrs?.map(({ key, value }) => (
            <AccordionItem key={key} value={key}>
              <AccordionTrigger className='text-xl font-bold'>{key}</AccordionTrigger>
              <AccordionContent>
                <div dangerouslySetInnerHTML={{ __html: value }} className='text-editor-display'></div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion> */}
      </section>
    </>
  );
}
