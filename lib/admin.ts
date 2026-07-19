export function checkAdminLogin(
  email:string,
  password:string
){

  return (

    email === process.env.ADMIN_EMAIL
    &&
    password === process.env.ADMIN_PASSWORD

  );

}