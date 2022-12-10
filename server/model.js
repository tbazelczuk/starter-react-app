const mongoose = require("mongoose");

const uristring =
  process.env.MONGODB_URI || "mongodb://localhost/HelloMongoose";

var NewsSchema = new mongoose.Schema(
  {
    url: String,
    value: String,
    selector: String,
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);

const NewsModel = mongoose.model("News", NewsSchema);

mongoose.set('strictQuery', false)

async function connect() {
  return new Promise(function (resolve, reject) {
    mongoose.connect(
      uristring,
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      },
      function (err, res) {
        if (err) {
          console.error("ERROR connecting to mongodb:", err);
          reject();
        } else {
          console.log("Succeeded connected to mongodb");
          resolve();
        }
      }
    );
  });
}

function disconnect() {
  mongoose.disconnect();
  console.log("Succeeded disconnect from mongodb");
}

async function getAll() {
  const items = await NewsModel.find(null, null, { sort: { created_at: 1 }, lean: true });
  return items.map(({ _id, url, value, selector }) => ({ _id, url, value, selector }))
}

const shouldUpdate = (item, doc) => {
  return item.value !== doc.value;
};

async function save(item) {
  return new Promise(function (resolve, reject) {
    const { url } = item;

    NewsModel.findOne({ url })
      .then((doc) => {
        if (!doc) {
          let model = new NewsModel(item);
          model
            .save()
            .then((doc) => {
              doc.newFlag = true;
              console.log("succeess saved", doc);
              resolve(doc);
            })
            .catch((err) => {
              console.log(err);
              reject();
            });
        } else if (shouldUpdate(item, doc)) {
          NewsModel.findOneAndUpdate({ url }, item, { new: true })
            .then((newDoc) => {
              newDoc.updateFlag = true;
              newDoc.prevItem = doc;
              console.log("succeess updated", newDoc);
              resolve(newDoc);
            })
            .catch((err) => {
              console.log(err);
              reject();
            });
        } else {
          reject();
        }
      })
      .catch((err) => {
        console.log(err);
        reject();
      });
  });
}

async function saveAll(items) {
  const arr = [];
  for (var i = 0; i < items.length; i++) {
    arr.push(save(items[i]));
  }
  const results = await Promise.allSettled(arr)
  return results.filter(({ status }) => status === 'fulfilled').map(({ value }) => value)
}

async function update(item) {
  console.log('update', item);

  return new Promise(function (resolve, reject) {
    NewsModel.updateOne({ _id: item._id }, item)
      .then(() => {
        resolve(item);
      })
      .catch((err) => {
        console.log(err);
        reject();
      });
  });
}

async function find(_id) {
  return new Promise((resolve, reject) => {
    NewsModel.findOne({ _id })
      .then((doc) => {
        resolve(doc);
      })
      .catch((err) => {
        console.log(err);
        reject();
      });
  });
}

function deleteById(_id) {
  return NewsModel.findByIdAndDelete(_id)
}

module.exports = {
  disconnect,
  connect,
  saveAll,
  deleteById,
  find,
  save,
  update,
  getAll,
};
