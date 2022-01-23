import { useEffect } from 'react';
import WordCloud from 'wordcloud';
import { ITags } from '@/types';

interface Props {
  tags: ITags;
  clickTag: (tag: string) => void;
}

const TagCloud = (props: Props) => {
  const { tags, clickTag } = props;

  useEffect(() => {
    const canvas = document.getElementById('wordcloud') as HTMLCanvasElement;
    if (!canvas) return;

    canvas.width = 1000;
    canvas.height = 600;

    // list 是一个数组，[[tag, count], [tag, count], ...]
    const list = Object.keys(tags).map((key) => [key, tags[key]]);

    WordCloud(canvas, {
      list,
      gridSize: Math.round((16 * 800) / 1024),
      fontFamily: 'Times, serif',
      weightFactor: 16,
      color: 'random-dark',
      rotateRatio: 0,
      // rotationSteps: 2,
      backgroundColor: '#fff',
      click: (item: [string, number]) => {
        const tag = item[0];
        clickTag(tag);
      },
    });
  }, [tags]);

  return (
    <div>
      <canvas id="wordcloud" />
    </div>
  );
};

export default TagCloud;
