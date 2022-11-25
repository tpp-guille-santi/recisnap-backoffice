// export default async function Page() {
//   // /blog/hello-world => { params: { slug: 'hello-world' } }
//   // /blog/hello-world?id=123 => { searchParams: { id: '123' } }
//   return <p>"Hi"</p>;
// }


// export default async function NotesPage({ params, searchParams }) {
//   const res = await fetch(`https://peaceful-refuge-34158.herokuapp.com/pages`, { cache: 'no-store' });
//   const notes = await res.json();
//   console.log(note)
//   return (
//     <div>
//       <h2>{note.material_name ? note.material_name : ''}</h2>
//       <h5>{note.municipio ? note.municipio : ''}</h5>
//       <p>{note.provincia ? note.provincia : ''}</p>
//       <p>{note.departamento ? note.departamento : ''}</p>
//     </div>
//   );
// }


// import PocketBase from 'pocketbase';
import Link from 'next/link';
import styles from './Notes.module.css';

// export const dynamic = 'auto',
//   dynamicParams = true,
//   revalidate = 0,
//   fetchCache = 'auto',
//   runtime = 'nodejs',
//   preferredRegion = 'auto'


async function getNotes() {
  // const db = new PocketBase('http://127.0.0.1:8090');
  // const result = await db.records.getList('notes');
  const res = await fetch(`https://peaceful-refuge-34158.herokuapp.com/pages`, { cache: 'no-store' });
  const notes = await res.json();
  return notes;
}

export default async function NotesPage() {
  const notes = await getNotes();

  return(
    <div>
      <h1>Notes</h1>
      <div className={styles.grid}>
        {notes?.map((note) => {
          return <Note key={note.id} note={note} />;
        })}
      </div>

    </div>
  );
}

function Note( {note} ) {

  return (
    <Link href={`/notes/${note.id}`}>
      <div className={styles.note}>
      <h2>{note.material_name ? note.material_name : ''}</h2>
      <h5>{note.municipio ? note.municipio : ''}</h5>
      <p>{note.provincia ? note.provincia : ''}</p>
      <p>{note.departamento ? note.departamento : ''}</p>
      </div>
      
    </Link>
  );
}