#! /usr/bin/env node

/**
Command-line interface (CLI) for FluentCV via Node.js.
@license Copyright (c) 2015 | James M. Devlin
*/

var ARGS = require( 'minimist' )
  , FCMD  = require( './fluentcmd')
  , PKG = require('../package.json')
  , opts = { };



try {
  main();
}
catch( ex ) {
  handleError( ex );
}



function main() {

  // Setup.
  var title = '*** FluentCV v' + PKG.version + ' ***';
  if( process.argv.length <= 2 ) { logMsg(title); throw { fluenterror: 3 }; }
  var args = ARGS( process.argv.slice(2) );
  opts = getOpts( args );
  logMsg( title );

  // Convert arguments to source files, target files, options
  var src = args._ || [];
  var dst = (args.o && ((typeof args.o === 'string' && [ args.o ]) || args.o)) || [];
  dst = (dst === true) ? [] : dst; // Handle -o with missing output file

  // Generate!
  FCMD.generate( src, dst, opts, logMsg );

  process.exit(0);
}

function logMsg( msg ) {
  opts.silent || console.log( msg );
}

function getOpts( args ) {
  var noPretty = args['nopretty'] || args.n;
  noPretty = noPretty && (noPretty === true || noPretty === 'true');
  return {
    theme: args.t || 'modern',
    prettify: !noPretty,
    silent: args.s || args.silent
  };
}

function handleError( ex ) {
  var msg = '', exitCode;
  if( ex.fluenterror ){
    switch( ex.fluenterror ) { // TODO: Remove magic numbers
      case 1: msg = "The specified theme couldn't be found: " + ex.data; break;
      case 2: msg = "Couldn't copy CSS file to destination folder"; break;
      case 3: msg = "Please specify a valid JSON resume file."; break;
    };
    exitCode = ex.fluenterror;
  }
  else {
    msg = ex.toString();
    exitCode = 4;
  }

  var idx = msg.indexOf('Error: ');
  var trimmed = idx === -1 ? msg : msg.substring( idx + 7 );
  console.log( 'ERROR: ' + trimmed.toString() );
  process.exit( exitCode );

}
