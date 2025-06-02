import javax.swing.*;
import java.awt.*;
import java.awt.event.*;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.Random;

public class FallingBalls extends JPanel implements ActionListener {
    private static final int WIDTH = 800;
    private static final int HEIGHT = 600;
    private static final int BALL_RADIUS = 10;
    private static final int DROP_INTERVAL_MS = 600; // 每 600 毫秒新增一個球（每分鐘約 100 顆）
    private static final int FALL_SPEED = 3;

    private java.util.List<Ball> balls = new ArrayList<>();
    private Timer fallTimer;
    private Timer generateTimer;
    private Random rand = new Random();

    public FallingBalls() {
        setPreferredSize(new Dimension(WIDTH, HEIGHT));
        setBackground(Color.BLACK);

        // 動畫更新（每 16ms = 約60fps）
        fallTimer = new Timer(16, this);
        fallTimer.start();

        // 每 DROP_INTERVAL_MS 新增一個球
        generateTimer = new Timer(DROP_INTERVAL_MS, e -> {
            int x = rand.nextInt(WIDTH - BALL_RADIUS * 2);
            Ball newBall = new Ball(x, 0, BALL_RADIUS, Color.BLUE); // 設定球的顏色為藍色
            balls.add(newBall);
            System.out.println("New ball added: " + newBall); // 調試球的生成
        });
        generateTimer.start();
    }

    @Override
    protected void paintComponent(Graphics g) {
        super.paintComponent(g);

        for (Ball ball : balls) {
            g.setColor(ball.color); // 使用球的顏色
            g.fillOval(ball.x, ball.y, ball.radius * 2, ball.radius * 2);
            System.out.println("Drawing ball: " + ball); // 調試球的繪製
        }
    }

    @Override
    public void actionPerformed(ActionEvent e) {
        Iterator<Ball> it = balls.iterator();
        while (it.hasNext()) {
            Ball ball = it.next();
            ball.y += FALL_SPEED;

            if (ball.y > HEIGHT) {
                it.remove(); // 移除到達底部的球
                System.out.println("Ball removed: " + ball); // 調試球的移除
            }
        }
        repaint(); // 確保畫布正確更新
    }

    public static void main(String[] args) {
        JFrame frame = new JFrame("Falling Balls");
        frame.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        frame.add(new FallingBalls());
        frame.pack();
        frame.setLocationRelativeTo(null);
        frame.setVisible(true);
    }

    // 小球類別
    static class Ball {
        int x, y, radius;
        Color color; // 新增顏色屬性

        Ball(int x, int y, int radius, Color color) {
            this.x = x;
            this.y = y;
            this.radius = radius;
            this.color = color; // 初始化顏色
        }

        @Override
        public String toString() {
            return "Ball{" +
                    "x=" + x +
                    ", y=" + y +
                    ", radius=" + radius +
                    ", color=" + color +
                    '}';
        }
    }
}
