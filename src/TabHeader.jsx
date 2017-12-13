import React from 'react'

export default (title, Icon) => {
  console.log(window.innerWidth);
  return window.innerWidth <= 500 ?
  <Icon color={'#FFF'}/> : title
}
