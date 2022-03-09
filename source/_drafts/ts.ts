// type A = () => string;
// type I = <T>() => T extends A ? string : number;
// const fn = (st: I) => {
//   st<string>();
// };
// function xx<I>(a: I) {
//   console.log(a);
// }
// export class C {
//   bar: Record<"key1" | "key2" | "key100", number>;
// }
// type TypeName<T> = T extends A ? boolean : number;
// type Ax = TypeName<string>;
// type x = typeof c["key1"];
// type ReturnType<T> = T extends (...args: any[]) => infer R ? R : any;
// type fn = (st: string, s: number) => string;
// const fun: fn = (st: aaaa) => {
//   return st;
// };
// type aaaa = ReturnType<fn>;

// // 业务代码文件
// // import C from 'mod'

// const c = new C()["bar"];

// let a: Pick<C["bar"], "key1">;
// // foo 函数用到了 c 实例的 bar 属性，请引用 C 中 bar 属性的类型作为 foo 函数 bar 参数的类型
// // (typeof c)['bar']
// function foo(bar: typeof c) {
//   console.log(bar.key1);
// }

// function chang<T extends number | Array<Number>>(params: T) {
//   if (params instanceof Array) {
//     let newParams = new Array();
//     params.forEach((v, k) => {
//       newParams.push(v);
//     });
//     return newParams;
//   } else if (params instanceof Number) {
//     return params;
//   }
// }
// type c = ReturnType<typeof chang>;
// const res = chang([1, 2, 3, 4]);
// const res1 = chang(123);

// // console.log(res1, res);

// type TTuple = [string, number];
// type TArray = Array<string | number>;

// type Res = TTuple extends TArray ? true : false; // true
// type ResO = TArray extends TTuple ? true : false; // false

// type ElementOf<T> = T extends Array<infer E> ? E : never;

// type tuple = [string, number];

// type unio = ElementOf<tuple>;

// type uu = tuple[number];

// type tt = {
//   bar: [string, number, boolean];
// };
// type dd = tt["bar"][number];

// const setCount = (n: number) => {
//   return <const>{
//     type: "SET_COUNT",
//     payload: n,
//   };
// };

// //this
// function x(this: number[], a: number) {
//   this[1] = 123;
//   console.log(this, a);
//   return a.toString(16);
// }

// let y: () => void = x.bind([1, 2, 3], "2");
// console.log(y());

// type withOutThis = OmitThisParameter<typeof x>;
// let y1: withOutThis = x.bind([1, 2, 3], "8");
// console.log(y1(123));

// const resetCount = () => {
//   return <const>{
//     type: "RESET_COUNT",
//   };
// };

// // console.log(setCount(1));
// type aa = typeof setCount;

// type CountActions = ReturnType<typeof setCount> | ReturnType<typeof resetCount>;

function myALl(promises: (Promise<unknown> | number)[]): Promise<unknown> {
  return new Promise(async (r, j) => {
    let res = [],
      isBreak = false;
    for (let promise of promises) {
      promise = promise instanceof Promise ? promise : Promise.resolve(promise);
      if (isBreak) break;
      await promise.then(
        (r) => res.push(r),
        (e) => {
          isBreak = true;
          j(e);
        }
      );
    }
    r(res);
  });
}
function myAllConcurrence(promises: Promise<unknown>[]) {
  return new Promise((r, j) => {
    let data = [],
      isError = false,
      num = promises.length;
    for (let promise of promises) {
      if (isError) break;
      promise = promise instanceof Promise ? promise : Promise.resolve(promise);
      promise
        .then((result) => {
          data.push(result);
          num ? r(data) : num--;
        })
        .catch((e) => {
          isError = true;
          j(e);
        });
    }
  });
}
let promises = [
  new Promise((r, j) => {
    setTimeout(() => {
      r(100);
    }, 2000);
  }),
  new Promise((r, j) => {
    setTimeout(() => {
      r(6);
    }, 100);
  }),
  new Promise((r, j) => {
    setTimeout(() => {
      r(4);
    }, 10);
  }),
];
let promises1 = [
  new Promise((r, j) => {
    setTimeout(() => {
      j(1);
    }, 3000);
  }),
  new Promise((r, j) => {
    setTimeout(() => {
      r(1);
    }, 2000);
  }),
  new Promise((r, j) => {
    setTimeout(() => {
      j(1);
    }, 2000);
  }),
  new Promise((r, j) => {
    setTimeout(() => {
      r(1);
    }, 2000);
  }),
];
console.time("my");
myALl(promises)
  .then((re) => {
    console.log("my", re);
    console.timeEnd("my");
  })
  .catch((e) => console.log(e));


console.time("promise");
Promise.all(promises)
  .then((re) => {
    console.log(re);
    console.timeEnd("promise");
  })
  .catch((e) => console.log(e));


console.time("myAllConcurrence");
myAllConcurrence(promises)
  .then((re) => {
    console.log(re);
    console.timeEnd("myAllConcurrence");
  })
  .catch((e) => console.log(e));

myALl(promises1)
  .then((re) => console.log(re))
  .catch((e) => console.log(e));
