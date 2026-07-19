import { getSessionUser } from "@/lib/actions/session";
import HeaderState from "./HeaderState";


export default async function HeaderWrapper(){


const user =
await getSessionUser();



return (

<HeaderState
user={user}
/>

);


}