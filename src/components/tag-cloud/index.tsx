import { useEffect } from 'react';
import wordcloud from 'wordcloud';

const TagCloud = () => {
  useEffect(() => {
    const canvas = document.getElementById('wordcloud') as HTMLCanvasElement;
    if (!canvas) return;

    canvas.width = 800;
    canvas.height = 600;

    wordcloud(canvas, {
      // TODO: 修改此处 list
      list: [
        ['test', 12],
        ['hello', 10],
        ['haha', 1],
        ['world', 8],
        ['react', 5],
      ],
      gridSize: Math.round((16 * 800) / 1024),
      fontFamily: 'Times, serif',
      weightFactor: 16,
      color: 'random-dark',
      rotateRatio: 0,
      rotationSteps: 2,
      backgroundColor: '#fff',
    });
  }, []);

  return (
    <div>
      <canvas id="wordcloud" />
    </div>
  );
};

export default TagCloud;
