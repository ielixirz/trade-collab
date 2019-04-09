import React from 'react';

const FileListContext = React.createContext({
  FileList: [{
    id: 1,
    name: 'transport.jpg',
  },
  {
    id: 2,
    name: 'transport.jpg',
  },
  ],
});

export default FileListContext;
