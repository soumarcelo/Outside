import NavBar from "@/app/components/navbars/navbar-app";

export default function MapLayout({ map, children }) {
  return (
    <div>
      {map}
      {children}
      <div className="position-fixed bottom-0 start-0 p-2">
        <NavBar onQuery={undefined} />
      </div>
    </div>
  );
}