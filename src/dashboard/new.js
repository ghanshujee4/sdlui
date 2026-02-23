// Online Javascript Editor for free
// Write, Edit and Run your Javascript code using JS Online Compiler
// obj1
//obj2
const dummyData = {
 userId: 101,
 name: "Anshul",
 isActive: true,
 profile: {
   email: "anshul@example.com",
   address: {
     city: "Bangalore",
     pincode: 560001
   }
  },
 roles: ["admin", "editor"],
 preferences: {
   theme: "dark",
   notifications: {
     email: true,
     sms: false
   }
  },
 orders: [
   {
     orderId: "ORD-1",
     amount: 1200,
     items: [
       { id: 1, name: "Laptop", price: 1000 },
       { id: 2, name: "Mouse", price: 200 }
     ]
   },
   {
     orderId: "ORD-2",
     amount: 800,
     items: [
       { id: 3, name: "Keyboard", price: 800 }
     ]
   }
  ],
}
function deepCopy(obj, seen = new
WeakMap()){
    if(obj === null) return obj;
    
    if(seen.has(obj)) return seen.get(obj);
    
    const copy = Array.isArray(obj) ? []: {};
    
    //seen.set(obj, copy);
    seen.set(obj, copy);

    for (const key in obj) {
        if(Object.prototype.hasOwnProperty.call(obj, key)){
            copy[key] = deepCopy(obj[key], seen);
        }
    }
   return copy;

}
  console.log(deepCopy(dummyData));
console.log("Try programiz.pro")