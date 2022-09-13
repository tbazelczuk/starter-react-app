
const mailer = require("./mailer");
const model = require("./model");
const { fetch } = require("./fetch");

const sendNotification = (items) => {
    const updatedItems = items.filter((item) => item.updateFlag);

    if (updatedItems.length) {
        console.log("updated items", updatedItems.length);
        mailer.sendMail(updatedItems);
    }
};

const merge = (items, values) => {
    return items.map(({ url, selector }, i) => {
        return { url, selector, value: values[i] };
    });
};

const fetchAndSave = async ({ url, selector }) => {
    const value = await fetch({ url, selector });
    const news = await model.save({ url, selector, value });
    return news
};

const fetchAll = async () => {
    const resp = await model.getAll();
    const values = await Promise.all(
        resp.map(({ url, selector }) => fetch({ url, selector }))
    );
    const items = await model.saveAll(merge(resp, values));
    console.log("fetched items", items.length);

    sendNotification(items);
    model.disconnect();

    return items;
};

const save = ({ url, selector, value }) => {
    return model.save({ url, selector, value });
};

const update = ({ _id, url, selector, value }) => {
    return model.update({ _id, url, selector, value });
};

const deleteById = (_id) => {
    return model.deleteById(_id);
};

const getAll = () => {
    return model.getAll();
}

const connect = () => {
    return model.connect();
}

module.exports = {
    fetchAndSave,
    fetchAll,
    fetch,
    deleteById,
    connect,
    update,
    getAll,
    save
}
