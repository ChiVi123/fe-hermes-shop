import { isFetchError } from '~/lib/fetchClient';
import { getMeFromServer } from '~/services/users';
import Addresses from './components/Addresses';
import EditProfileForm from './components/EditProfileForm';

export default async function ProfilePage() {
  // const cookieHeader = await getCookiesString();
  // const accessToken = (await cookies()).get(TokenName.ACCESS_TOKEN);
  // const user = await getMeFromServer(accessToken?.value);
  const user = await getMeFromServer();

  // if (user instanceof FetchError && user.status === HttpStatus.GONE) {
  //   redirect(RoutePath.Logout);
  // }

  return (
    <main className='min-h-screen pt-6'>
      <h1 className='max-w-5xl mx-auto mb-8 px-7 text-xl font-bold'>Profile</h1>

      <div className='max-w-5xl mx-auto space-y-6'>
        <div className='flex flex-col gap-y-2 mx-7 p-5 bg-accent rounded-2xl'>
          <div className='flex items-center gap-x-2'>
            {isFetchError(user) ? null : <EditProfileForm username={user.username} />}
          </div>

          <div className='flex flex-col gap-y-1'>
            <span className='text-sm text-muted-foreground font-semibold'>Email</span>
            <span className='text-sm font-semibold'>{isFetchError(user) ? 'm@gmail.com' : user.email}</span>
          </div>
        </div>

        <Addresses />
      </div>
    </main>
  );
}
