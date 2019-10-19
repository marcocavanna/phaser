module.exports = function getBabelConfig(babelApi) {

  const { NODE_ENV } = process.env;

  /** Use Babel Cache, based on NODE_ENV */
  babelApi.cache.using(() => NODE_ENV);

  /** Check if NODE_ENV is 'production' like */
  const isProduction = /(production|test)/.test(NODE_ENV);

  /** Return Babel Configuration */
  return {

    /** Set Babel Preset */
    presets: [

      ['@babel/preset-env', {
        modules     : 'auto',
        useBuiltIns : 'usage',
        corejs      : 3,
        targets     : {
          node     : '8.16.0',
          browsers : '> 0.25%, not dead'
        },
        debug: !isProduction
      }],

      ...(isProduction ? [
        'minify'
      ] : [])

    ],

    /** Set Babel Plugins */
    plugins: [
      ...(NODE_ENV !== 'test' ? [
        /** https://babeljs.io/docs/en/babel-plugin-transform-runtime */
        '@babel/plugin-transform-runtime'
      ] : []),

      /** https://babeljs.io/docs/en/babel-plugin-proposal-class-properties */
      '@babel/plugin-proposal-class-properties',

      /** https://babeljs.io/docs/en/babel-plugin-proposal-export-default-from */
      '@babel/plugin-proposal-export-default-from',

      /** https://babeljs.io/docs/en/babel-plugin-proposal-export-namespace-from */
      '@babel/plugin-proposal-export-namespace-from',

      /**
       * Pick only Lodash required module
       * https://github.com/lodash/babel-plugin-lodash
       */
      'lodash',

      /**
       * Allow the usage of the optional chaning
       * in object, like a.b?.c?
       * https://babeljs.io/docs/en/babel-plugin-proposal-optional-chaining
       */
      '@babel/plugin-proposal-optional-chaining',

      /**
       * Plugins for Development Environment only
       */
      ...(!isProduction ? [

        /**
         * Add Filename and Row for Console.log statement
         * https://github.com/peteringram0/babel-plugin-console-source
         */
        ['console-source',
          {
            segments: 2
          }
        ]

      ] : []),

      /**
       * Plugins for production only
       */
      ...(isProduction ? [

        /**
         * Remove Console Log and Debugger
         * https://github.com/betaorbust/babel-plugin-groundskeeper-willie
         */
        'groundskeeper-willie'

      ] : [])

    ],

    /** Strip Comments on Development */
    comments: !isProduction,

    /** Minifiy on Production */
    compact: isProduction,

    /** Set unambigous source Type */
    sourceType: 'unambiguous',

    /** Build source map on development */
    sourceMap: !isProduction

  };

};
