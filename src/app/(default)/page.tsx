import Image from 'next/image';

const SLIDES = [
  {
    title: 'Bestseller',
    description: 'Fan-Favorite Sneakers, Flats, and Slip-Ons',
    imageSrc: '/images/home_page_left_collection.avif',
  },
  {
    title: 'New Arrivals',
    description: 'The Latest Styles & Limited-Edition Colors',
    imageSrc: '/images/home_page_center_collection.avif',
  },
  {
    title: 'Spring Essentials',
    description: 'Breezy Shoes For Warmer Days Ahead',
    imageSrc: '/images/home_page_right_collection.avif',
  },
];

export default async function Home() {
  return (
    <div className='my-12'>
      <section className='mb-10'>
        <div className='flex items-center gap-2 w-full px-10'>
          {SLIDES.map((item) => (
            <div key={item.title} className='relative w-1/3 min-w-1/3 aspect-[4/5] overflow-hidden group'>
              <Image
                src={item.imageSrc}
                alt={item.title}
                fill
                priority
                sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
                className='max-h-full object-cover -z-10 transition-transform duration-300 ease-in-out will-change-transform group-hover:scale-105'
              />
              <div className='h-full px-8 py-16 bg-black/20'>
                <h2 className='text-2xl font-bold text-center text-white'>{item.title}</h2>
                <p className='text-center text-white'>{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className='mb-10'>
        <div className='grid grid-cols-2 gap-2 px-10'>
          <div className='relative overflow-hidden group'>
            <Image
              src='/images/home_page_rock_and_stroll.avif'
              alt='home_page_rock_and_stroll'
              width={2000 * 0.4}
              height={2000 * 0.4}
              priority
              className='size-full object-cover -z-10 transition-transform duration-300 ease-in-out will-change-transform group-hover:scale-105'
            />

            <div className='absolute right-0 bottom-0 left-0 p-10 text-white'>
              <p className='text-2xl font-bold'>Rock And Stroll In Comfort</p>
              <p className='text-lg'>
                Effortlessly comfy styles take color cues from the Southwest’s rustic rock formations.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section>
        <h2 className='px-10 mb-8 text-xl font-bold'>More To Shop</h2>
      </section>

      <div className='pb-12'></div>
    </div>
  );
}
