import { isHttpError } from '~/lib/fetchain';
import { getMeServerApi } from '~/services/users';
import Addresses from './components/Addresses';
import EditProfileForm from './components/EditProfileForm';

export default async function ProfilePage() {
  const user = await getMeServerApi();

  return (
    <main className='min-h-screen pt-6'>
      <h1 className='max-w-5xl mx-auto mb-8 px-7 text-xl font-bold'>Profile</h1>

      <div className='max-w-5xl mx-auto space-y-6'>
        <div className='flex flex-col gap-y-2 mx-7 p-5 bg-accent rounded-2xl'>
          <div className='flex items-center gap-x-2'>
            {user === undefined || isHttpError(user) ? null : <EditProfileForm username={user.username} />}
          </div>

          <div className='flex flex-col gap-y-1'>
            <span className='text-sm text-muted-foreground font-semibold'>Email</span>
            <span className='text-sm font-semibold'>
              {user === undefined || isHttpError(user) ? 'm@gmail.com' : user.email}
            </span>
          </div>
        </div>

        <Addresses />
      </div>
    </main>
  );
}
