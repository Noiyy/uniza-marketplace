const Agenda = require('agenda');
const Product = require("../models/productModel");
const ProductHistory = require("../models/productHistoryModel");

const agenda = new Agenda({
  db: { address: process.env.MONGO_URI },
  processEvery: '1 minute'
});

agenda.define('end sale after 72h', async (job) => {
  const { productId, userId } = job.attrs.data;
  
  const product = await Product.findById(productId);
  if (!product) return;

  product.status = "saleEnded";
  await product.save();

  const historyEntry = new ProductHistory({
    productId: productId,
    historyType: 'saleEnded',
    oldValue: "-",
    newValue: "-",
    byUserId: userId
  });
  await historyEntry.save();
});



const startAgenda = async () => {
  await agenda.start();
  console.log('Agenda scheduler started');
}

module.exports = { agenda, startAgenda };
