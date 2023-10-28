import { findOrders } from '@/server/api/routers/pos/order'
import { prisma } from '@/server/db';
import dayjs from 'dayjs';
import { type NextApiHandler } from 'next'

const handler: NextApiHandler = async (req, res) => {
  for (let i = 0; i < 7; i++) {
    await findOrders({ prisma }, {
      dateStart: dayjs().startOf('day').add(i, 'days').subtract(8, 'hours').toDate(),
      dateEnd: dayjs().endOf('day').add(i, 'days').subtract(8, 'hours').toDate()
    });
  }
}

export default handler