var socket = io.connect('http://localhost:4200');

socket.on('connect', function(data) {
  $( '#joinroom' ).click( () => {
    socket.emit('join room', 'pi-1');

    socket.on('join room response', d => {
      console.log( d );
    })
  } );

  $( '#evaluate' ).click( () => {
    socket.emit('evaluate', "3^2\cdot5+1");
  } );

  $( '#clear' ).click( () => {
    socket.emit('clear queue');
  } );

  socket.on( 'queue changed', queue => {
    console.log( queue );

    $("#queue").html( JSON.stringify( queue ) );
  } );

  socket.on( 'robot step', step => {
    console.log( step );

    $("#current-step").html( step );
  } );

  socket.on( 'robot done', results => {
    console.log( results.result );

    $("#current-step").html( `Result: ${ results.result }` );
  } );

  socket.on( 'evaluate error', err => {
    $("#current-step").html( `Error: ${err}` );
  } );

  $( '#next' ).click( () => {
    socket.emit('next step');
  } );
});
