export default async function OrderConfirmationPage(props: {
  params: Promise<{ id: string }>
}) {
  const { id } = await props.params
  return <main><h1 className="type-headline-lg">Order {id} Confirmed</h1></main>
}
