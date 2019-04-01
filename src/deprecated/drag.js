const drag = (setOffsetX, setOffsetY, x, y) => (e) => {
  console.log('dragging')
  e.dataTransfer.setData("text", e.target.id);
  const style = window.getComputedStyle(e.target, null);
  setOffsetX(parseInt(style.getPropertyValue("left"),10) - e.clientX)
  setOffsetY(parseInt(style.getPropertyValue("top"),10) - e.clientY)
}

const drop = (setX, setY, offsetX, offsetY) => (e) => {
  console.log('dropping')
  e.preventDefault();
  setX(e.clientX + offsetX);
  setY(e.clientY + offsetY);
}

  /*const drag = (setOldX, setOldY, x, y) => (e) => {
  e.dataTransfer.setData("text", e.target.id);
  setOldX(e.screenX + x);
  setOldY(e.screenY + y);
}*/

  /*function Draggable(props) {
  const [x, setX] = useState(200)
  const [y, setY] = useState(200)
  const [oldX, setOldX] = useState(0)
  const [oldY, setOldY] = useState(0)
  const position = {
        position: 'absolute',
        left: `${x}px`,
        top: `${y}px`,*/
        /*transform: `translate(${x}px, ${y}px)`,
        transformOrigin: '0 0 ',*//*
      }
  return (
    <div className="draggable"
      onDragEnd={drop(setX, setY, oldX, oldY)}
      onDrag={() => console.log('on drag')}
      onDragStart={drag(setOldX, setOldY, x, y)}
      draggable="true"
      style={position}
    >
      {props.children}
    </div>
  )
}*/

