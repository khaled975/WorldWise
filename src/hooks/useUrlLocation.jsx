import { useSearchParams } from "react-router-dom";

export function useUrlLocation() {
  const [searchParams, setSearchParams] = useSearchParams();
  console.log(searchParams);

  const lat = searchParams.get("lat");
  const lng = searchParams.get("lng");
  return [lat, lng];
}
