namespace szamnegyesek
{
    public partial class Form1 : Form
    {
        public Form1()
        {
            InitializeComponent();
        }

        private void buttonA_Click(object sender, EventArgs e)
        {
            for (int i = 0; i < 2; i++)
                for (int j = 0; j < 2; j++)
                    IncrementLabel(i, j);
        }
        private void buttonB_Click(object sender, EventArgs e)
        {
            for (int i = 0; i < 2; i++)
                for (int j = 1; j < 3; j++)
                    IncrementLabel(i, j);
        }
        private void buttonC_Click(object sender, EventArgs e)
        {
            for (int i = 1; i < 3; i++)
                for (int j = 0; j < 2; j++)
                    IncrementLabel(i, j);
        }
        private void buttonD_Click(object sender, EventArgs e)
        {
            for (int i = 1; i < 3; i++)
                for (int j = 1; j < 3; j++)
                    IncrementLabel(i, j);
        }
        private void buttonReset_Click(object sender, EventArgs e)
        {
            for (int i = 0; i < 3; i++)
                for (int j = 0; j < 3; j++)
                    gridLabels[i, j].Text = "0";
        }
        private void IncrementLabel(int i, int j)
        {
            int value = int.Parse(gridLabels[i, j].Text);
            value++;
            gridLabels[i, j].Text = value.ToString();
        }
    }
}
