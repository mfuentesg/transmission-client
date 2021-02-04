export function to(promise: Promise<any>): Promise<any> {
  return promise
    .then((data: JSON) => {
      return [null, data];
    })
    .catch((err: Error) => [err]);
}
