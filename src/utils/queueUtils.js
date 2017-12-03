export const getUserPositionInQueue = ( queue, id ) => {
  return queue.findIndex( e => e.user.id === id )
}
