function sanitizeObj (obj) {
    if (obj instanceof Object) {
        for (const key in obj) {
            console.log("key:", key);
            // console.log(Object.prototype.hasOwnProperty.call(obj, key))
            if (Object.prototype.hasOwnProperty.call(obj, key)) {
                // console.log("obj:", obj, "key", key)
                if (key.startsWith("$")) {
                    delete obj[key];
                } else {
                    sanitizeObj(obj[key])
                }
            }
        }
    }
}

const myObj = {
    title: "mang",
    ingredients: [
        {name: "carrot", qty: 3, unit: "g"},
        {name: "carrot", qty: 3, unit: "$g"},
    ],
    processes: [
        {
            description: "yumyum",
            $set: "honjaaka"
        }
    ],
    $isDraft: true,
}

sanitizeObj(myObj)
console.log(myObj);