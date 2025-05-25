// pages/index.jsx
export async function getServerSideProps() {
  return {
    redirect: {
      destination: '/contact',
      permanent: true, // 301
    },
  };
}

export default function Index() {
  return null;
}
