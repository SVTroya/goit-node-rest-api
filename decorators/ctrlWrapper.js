export function ctrlWrapper(ctrl) {
  async function func(req, res, next) {
    try {
      await ctrl(req, res)
    } catch (error) {
      next(error)
    }
  }

  return func
}