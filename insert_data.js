const { Client } = require('pg');

const dbUrl = 'postgresql://neondb_owner:npg_Y3JvOCgQIfD6@ep-still-cherry-agzfkkak-pooler.c-2.eu-central-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require';

const client = new Client({
  connectionString: dbUrl,
});

const materials = [
  { title: 'Tutoriat 1 (PDF)', link: 'https://drive.google.com/file/d/12yLYCk5R2THSlL9u3x8IxO-TlIIAEKJ-/view?usp=drive_link', category: 'tutoriat', type: 'PDF', created_at: '2026-03-18T10:00:00' },
  { title: 'Tutoriat 2 (PDF)', link: 'https://drive.google.com/file/d/1w3FUczHsIn-7kRVvOkfcLQgFGJxlquQr/view?usp=drive_link', category: 'tutoriat', type: 'PDF', created_at: '2026-03-25T10:00:00' },
  { title: 'Tutoriat 5 (PDF)', link: 'https://drive.google.com/file/d/1-inGc1jV8ucVtirVNdbIU24nWJe_U44A/view?usp=drive_link', category: 'tutoriat', type: 'PDF', created_at: '2026-04-22T10:00:00' },
  { title: 'Tutoriat 8 Teorie (PDF)', link: 'https://drive.google.com/file/d/100k6SpYkK199kmkHvdpfG4KAuRxtejSD/view?usp=drive_link', category: 'tutoriat', type: 'PDF', created_at: '2026-05-12T10:00:00' },
  { title: 'Tutoriat 8 Exerciții (PDF)', link: 'https://drive.google.com/file/d/1h1-Rq5C2qaHwanovJN3-55w4NDOFxEA2/view?usp=drive_link', category: 'tutoriat', type: 'PDF', created_at: '2026-05-12T11:00:00' },
  { title: 'Tutoriat 8 (Video)', link: 'https://teams.cloud.microsoft/l/meetingrecap?driveId=b%21V72V1b_ypki2lyU6SlaPckU0to9T2QlIqrM_EoP88WtlGxL8BB_qTLRt-slvyd9U&driveItemId=01PDUSWFCCC2SH3J2F6NHYJ6TSMSDEC6U4&sitePath=https%3A%2F%2Funibucro0-my.sharepoint.com%2F%3Av%3A%2Fg%2Fpersonal%2Fandrei-stefan_neacsu_s_unibuc_ro%2FIQBCFqR9p0XzT4T6cmSGQXqcAVF32gmsEXvVi0z1GGoEfhk&fileUrl=https%3A%2F%2Funibucro0-my.sharepoint.com%2Fpersonal%2Fandrei-stefan_neacsu_s_unibuc_ro%2FDocuments%2FRecordings%2FTutoriat+Matematici+Speciale+%2825.04.2026%29-20260425_170527-Meeting+Recording.mp4%3Fweb%3D1&iCalUid=040000008200e00074c5b7101a82e008000000002f0a71d447d2dc010000000000000000100000008bb618a93c95554b8d83f949a09cc54b&threadId=19%3Ameeting_MjM2MGE5NWEtMWUwMC00NjExLWI5ZTEtM2RiMmQzYjEyNDg3%40thread.v2&organizerId=ec69925a-baa1-4f3f-b2e1-188029e72ba1&tenantId=08a1a72f-fecd-4dae-8cec-471a2fb7c2f1&callId=89a70a7c-7890-4f7d-ae75-a86a223fd34e&threadType=Meeting&meetingType=Scheduled&subType=RecapSharingLink_RecapCore&recapType=RecordingAndTranscript', category: 'tutoriat', type: 'Video', created_at: '2026-05-13T10:00:00' },
  { title: 'Tutoriat 9 (Video)', link: 'https://teams.cloud.microsoft/l/meetingrecap?driveId=b%21V72V1b_ypki2lyU6SlaPckU0to9T2QlIqrM_EoP88WtlGxL8BB_qTLRt-slvyd9U&driveItemId=01PDUSWFCFX3HGYI5RQJHKB5HYR57QFERL&sitePath=https%3A%2F%2Funibucro0-my.sharepoint.com%2F%3Av%3A%2Fg%2Fpersonal%2Fandrei-stefan_neacsu_s_unibuc_ro%2FIQBFvs5sI7GCTqD0-I9_ApIrAVZR0LT9tu-vV3dKIt8viZk&fileUrl=https%3A%2F%2Funibucro0-my.sharepoint.com%2Fpersonal%2Fandrei-stefan_neacsu_s_unibuc_ro%2FDocuments%2FRecordings%2FTutoriat+Matematici+Speciale+%2816.05.2026%29-20260516_160910-Meeting+Recording.mp4%3Fweb%3D1&iCalUid=040000008200e00074c5b7101a82e00800000000883de03010e5dc01000000000000000010000000f79423446f829944b83271d72824eb73&threadId=19%3Ameeting_ZjAyODQ5MzMtMGQyZi00YjViLThmZjItYzE0ZmI4NjZkZWE3%40thread.v2&organizerId=ec69925a-baa1-4f3f-b2e1-188029e72ba1&tenantId=08a1a72f-fecd-4dae-8cec-471a2fb7c2f1&callId=99a63b90-8561-4e5d-be4e-a097a8244f45&threadType=Meeting&meetingType=Scheduled&subType=RecapSharingLink_RecapCore&recapType=RecordingAndTranscript', category: 'tutoriat', type: 'Video', created_at: '2026-05-20T10:00:00' },
];

const announcements = [
  { title: 'Începerea tutoriatului', body: 'Prima întâlnire va avea loc marți, 17 martie, ora 18:00, în sala 107. Vă așteptăm!', author: 'Neacșu Andrei Ștefan', created_at: '2026-03-07T10:00:00' },
  { title: 'Platforma Matematici Speciale', body: 'Începând de azi, platforma online pentru Matematici Speciale aferentă acestui an universitar este disponibilă! Accesul este dedicat doar persoanelor autorizate. Pentru a primi credențiale de autentificare, vă rugăm să contactați unul dintre tutori.', author: 'Nițuică Andrei Sebastian', created_at: '2026-03-18T10:00:00' },
  { title: 'Acces Platforma Matematici Speciale', body: 'Accesul este permis și cu conturi personale, dar acestea trebuie să treacă printr-un proces de verificare. În acest sens, după crearea contului pe site, vă rugăm să contactați unul dintre tutori!', author: 'Neacșu Andrei Ștefan', created_at: '2026-03-25T10:00:00' },
  { title: 'Tutoriat anulat', body: 'Considerând situația unuia dintre tutori, tutoriatul planificat pentru 7 aprilie 2026 se anulează!', author: 'Nițuică Andrei Sebastian', created_at: '2026-04-06T10:00:00' },
  { title: 'Tutoriat anulat', body: 'Considerând situația unuia dintre tutori, tutoriatul planificat pentru 21 aprilie 2026 se anulează!', author: 'Neacșu Andrei Ștefan', created_at: '2026-04-20T10:00:00' },
  { title: 'Modificare orar', body: 'DOAR săptămâna aceasta tutoriatul se va desfășura sâmbătă, 25 aprilie, ora 17:00, în regim online! Sesiunea va avea 3 ore pentru a recupera ultimele două tutoriate anulate.', author: 'Nițuică Andrei Sebastian', created_at: '2026-04-22T10:00:00' },
  { title: 'Sesiune Tutoriat MS (25.04.2026)', body: 'Aveți link-ul de conectare aferent sesiunii de tutoriat din data de 25 aprilie 2026. ...', author: 'Neacșu Andrei Ștefan', created_at: '2026-04-25T16:00:00' },
  { title: 'Prezență Tutoriat MS (25.04.2026)', body: 'Aveți mai jos atașat link-ul pentru Google Forms destinat înregistrării prezenței la sesiunea de tutoriat din 25 aprilie 2026. Formularul va rămâne deschis doar pe durata desfășurării tutoriatului. Vă rugăm să vă înregistrați în timp util! ...', author: 'Nițuică Andrei Sebastian', created_at: '2026-04-25T16:30:00' },
  { title: 'Revenire la programul normal', body: 'Se revine la programul normal, marțea, între orele 18:00 și 20:00 în sala 107!', author: 'Neacșu Andrei Ștefan', created_at: '2026-04-28T10:00:00' },
  { title: 'Tutoriat anulat', body: 'Considerând situația unuia dintre tutori, tutoriatul planificat pentru 5 mai 2026 se anulează!', author: 'Nițuică Andrei Sebastian', created_at: '2026-05-04T10:00:00' },
  { title: 'Tutoriat anulat', body: 'Considerând situația unuia dintre tutori, tutoriatul planificat pentru 12 mai 2026 se anulează!', author: 'Neacșu Andrei Ștefan', created_at: '2026-05-11T10:00:00' },
  { title: 'Modificare orar', body: 'DOAR săptămâna aceasta tutoriatul se va desfășura mâine, 16 mai, ora 16:00, în regim online! Sesiunea va avea 3 ore pentru a recupera ultimele două tutoriate anulate.', author: 'Nițuică Andrei Sebastian', created_at: '2026-05-15T10:00:00' },
  { title: 'Sesiune Tutoriat MS (16.05.2026)', body: 'Aveți link-ul de conectare aferent sesiunii de tutoriat din data de 16 mai 2026. ...', author: 'Neacșu Andrei Ștefan', created_at: '2026-05-16T15:00:00' },
  { title: 'Prezență Tutoriat MS (16.05.2026)', body: 'Aveți mai jos atașat link-ul pentru Google Forms destinat înregistrării prezenței la sesiunea de tutoriat din 16 mai 2026. Formularul va rămâne deschis doar pe durata desfășurării tutoriatului. Vă rugăm să vă înregistrați în timp util! ...', author: 'Nițuică Andrei Sebastian', created_at: '2026-05-16T15:30:00' },
  { title: 'Revenire la programul normal', body: 'Se revine la programul normal, marțea, între orele 18:00 și 20:00 în sala 107!', author: 'Neacșu Andrei Ștefan', created_at: '2026-05-18T10:00:00' },
  { title: 'Formular de întrebări', body: 'A fost publicat formularul de întrebări! De acum, vă puteți trimite întrebările pentru sesiunea de recapitulare.\n\nAcesta poate fi accesat la adresa http://www.matematicispeciale.site/formular-intrebari', author: 'Nițuică Andrei Sebastian', created_at: '2026-06-03T10:00:00' },
  { title: 'Succes în sesiune!', body: 'Vă urăm succes în sesiune!', author: 'Neacșu Andrei Ștefan', created_at: '2026-06-08T09:00:00' },
  { title: 'Anunț Programare Tutoriat recapitulare', body: 'Mâine ne vedem în sala 209 de la ora 10:00 la 12:00 pentru a discuta întrebările voastre.', author: 'Nițuică Andrei Sebastian', created_at: '2026-06-08T10:00:00' },
  { title: 'Succes la examen!', body: 'Vă urăm mult succes la examenul de Matematici Speciale!', author: 'Neacșu Andrei Ștefan', created_at: '2026-06-15T10:00:00' },
];

async function insertData() {
  try {
    await client.connect();
    console.log('Connected to DB...');

    for (const m of materials) {
      await client.query(
        'INSERT INTO materials (title, link, category, type, created_at) VALUES ($1, $2, $3, $4, $5)',
        [m.title, m.link, m.category, m.type, m.created_at]
      );
      console.log(`Inserted material: ${m.title}`);
    }

    for (const a of announcements) {
      await client.query(
        'INSERT INTO announcements (title, body, author, created_at) VALUES ($1, $2, $3, $4)',
        [a.title, a.body, a.author, a.created_at]
      );
      console.log(`Inserted announcement: ${a.title}`);
    }

    console.log('Data successfully inserted.');
  } catch (err) {
    console.error('Error inserting data:', err);
  } finally {
    await client.end();
  }
}

insertData();
