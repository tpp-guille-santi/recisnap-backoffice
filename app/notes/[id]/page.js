
export default async function NotePage({ params, searchParams }) {
  const res = await fetch(`https://peaceful-refuge-34158.herokuapp.com/pages/${params.id}`, { cache: 'no-store' });
  const note = await res.json();
  console.log(note)
  return (
    <div>
      <h2>{note.material_name ? note.material_name : ''}</h2>
      <h5>{note.municipio ? note.municipio : ''}</h5>
      <p>{note.provincia ? note.provincia : ''}</p>
      <p>{note.departamento ? note.departamento : ''}</p>
    </div>
  );
}
