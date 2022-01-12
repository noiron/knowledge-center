import { useState } from 'react';
import axios from 'axios';
import Tag from './tag';

const TagList = (props: any) => {
  const [list, setList] = useState([]);

  const getTag = (text: string) => {
    axios.get(`/api/tag/${text}`).then((res) => {
      console.log('获取到文件如下：', res.data.data);
      setList(res.data.data);
    });
  };

  return (
    <div>
      <div>
        {props.tags.map((tag: string) => {
          return (
            <div
              style={{
                padding: '0px 20px',
                margin: '10px 0',
              }}
              key={tag}
            >
              <Tag text={tag} onClick={(text) => getTag(text)} />
            </div>
          );
        })}
      </div>
      <div
        style={{
          borderTop: '1px solid #eee',
          padding: '20px',
        }}
      >
        <p>这里是包含选中标签的文件列表</p>
        {list.map((file: any) => {
          return (
            <div
              style={{
                margin: '10px 0',
              }}
              key={file}
            >
              {file}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TagList;
