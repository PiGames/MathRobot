export default function mathMlToClickable(mathMlExpression, clickable = []) {
  const {children, innerHTML} = mathMlExpression

  if (children.length === 0) {
    clickable.push(...innerHTML.split(''))
    return clickable
  }

  for (const child of children) {
    mathMlToClickable(child, clickable)
  }

  return clickable
}
