package test.attr;

public class FileCopy {

	/**
	 * @param args
	 */
	public static void main(String[] args) {
		String[] source ={
				"F:\\self\\��ҵ\\΢Ȧ\\��������\\��վ\\���ں�ͼƬ\\IT��ҵ\\meetsh��վ����.jpg",
				"F:\\self\\��ҵ\\΢Ȧ\\��������\\��վ\\���ں�ͼƬ\\IT��ҵ\\��ƽ�ɷ�.jpg",
				"F:\\self\\��ҵ\\΢Ȧ\\��������\\��վ\\���ں�ͼƬ\\�������\\i-D��Ӱʱ�л���.jpeg",
				"F:\\self\\��ҵ\\΢Ȧ\\��������\\��վ\\���ں�ͼƬ\\�������\\������ɴ��Ӱ����.jpg",
				"F:\\self\\��ҵ\\΢Ȧ\\��������\\��վ\\���ں�ͼƬ\\�������\\���ֱ�������.jpg",
				"F:\\self\\��ҵ\\΢Ȧ\\��������\\��վ\\���ں�ͼƬ\\��������\\babyArt���ձ���.jpg",
				"F:\\self\\��ҵ\\΢Ȧ\\��������\\��վ\\���ں�ͼƬ\\��������\\��֪Ӣ��.jpg",
				"F:\\self\\��ҵ\\΢Ȧ\\��������\\��վ\\���ں�ͼƬ\\��������\\�ϵ�.jpg",
				"F:\\self\\��ҵ\\΢Ȧ\\��������\\��վ\\���ں�ͼƬ\\��������\\ѧ������Ϻ�΢�ź�.jpg",
				"F:\\self\\��ҵ\\΢Ȧ\\��������\\��վ\\���ں�ͼƬ\\��������\\��˼Դ����.jpg",
				"F:\\self\\��ҵ\\΢Ȧ\\��������\\��վ\\���ں�ͼƬ\\��������\\����������VIP��������.png",
				"F:\\self\\��ҵ\\΢Ȧ\\��������\\��վ\\���ں�ͼƬ\\��������\\�������ֹ���.jpeg",
				"F:\\self\\��ҵ\\΢Ȧ\\��������\\��վ\\���ں�ͼƬ\\��������\\����־.jpg",
				"F:\\self\\��ҵ\\΢Ȧ\\��������\\��վ\\���ں�ͼƬ\\��������\\������.jpg",
				"F:\\self\\��ҵ\\΢Ȧ\\��������\\��վ\\���ں�ͼƬ\\��ױ��ԡ��Ʒ\\REnex������.jpg",
				"F:\\self\\��ҵ\\΢Ȧ\\��������\\��վ\\���ں�ͼƬ\\��ױ��ԡ��Ʒ\\�Ϻ���羻�ױƷ.jpg",
				"F:\\self\\��ҵ\\΢Ȧ\\��������\\��վ\\���ں�ͼƬ\\��ױ��ԡ��Ʒ\\�����ඦҺ̬����ϵ��.jpg",
				"F:\\self\\��ҵ\\΢Ȧ\\��������\\��վ\\���ں�ͼƬ\\��ױ��ԡ��Ʒ\\��ޢ����Ƽ�.jpg",
				"F:\\self\\��ҵ\\΢Ȧ\\��������\\��վ\\���ں�ͼƬ\\ҽ�ƽ���\\�Ϻ�Ʒ���ۿ�.jpg",
				"F:\\self\\��ҵ\\΢Ȧ\\��������\\��վ\\���ں�ͼƬ\\ҽ�ƽ���\\������.jpg",
				"F:\\self\\��ҵ\\΢Ȧ\\��������\\��վ\\���ں�ͼƬ\\ҽ�ƽ���\\ʥ�Ľ���.jpg",
				"F:\\self\\��ҵ\\΢Ȧ\\��������\\��վ\\���ں�ͼƬ\\ҽ�ƽ���\\��Դ�ú÷佺.jpg",
				"F:\\self\\��ҵ\\΢Ȧ\\��������\\��վ\\���ں�ͼƬ\\ҽ�ƽ���\\����.jpg",
				"F:\\self\\��ҵ\\΢Ȧ\\��������\\��վ\\���ں�ͼƬ\\ҽ�ƽ���\\��·-����֮·.jpg",
				"F:\\self\\��ҵ\\΢Ȧ\\��������\\��վ\\���ں�ͼƬ\\�������\\�Ϻ�����Ͷ��.jpg",
				"F:\\self\\��ҵ\\΢Ȧ\\��������\\��վ\\���ں�ͼƬ\\�������\\�Ϻ������ֹ���ó�����޹�.jpg",
				"F:\\self\\��ҵ\\΢Ȧ\\��������\\��վ\\���ں�ͼƬ\\�������\\������ӡ�����.jpg",
				"F:\\self\\��ҵ\\΢Ȧ\\��������\\��վ\\���ں�ͼƬ\\�������\\��̨΢�����һƽ̨���ֶ�.jpg",
				"F:\\self\\��ҵ\\΢Ȧ\\��������\\��վ\\���ں�ͼƬ\\�������\\�����Ļ�.jpg",
				"F:\\self\\��ҵ\\΢Ȧ\\��������\\��վ\\���ں�ͼƬ\\�̳�����\\WMF.jpg",
				"F:\\self\\��ҵ\\΢Ȧ\\��������\\��վ\\���ں�ͼƬ\\�̳�����\\С˧������.jpg",
				"F:\\self\\��ҵ\\΢Ȧ\\��������\\��վ\\���ں�ͼƬ\\�̳�����\\�´�ҵ�鱦.jpg",
				"F:\\self\\��ҵ\\΢Ȧ\\��������\\��վ\\���ں�ͼƬ\\�̳�����\\����ʫ΢�̳�.jpeg",
				"F:\\self\\��ҵ\\΢Ȧ\\��������\\��վ\\���ں�ͼƬ\\���ּ�����\\�������ʣ��������.jpg",
				"F:\\self\\��ҵ\\΢Ȧ\\��������\\��վ\\���ں�ͼƬ\\���ּ�����\\���.jpg",
				"F:\\self\\��ҵ\\΢Ȧ\\��������\\��վ\\���ں�ͼƬ\\���ּ�����\\�����Ļ�.jpg",
				"F:\\self\\��ҵ\\΢Ȧ\\��������\\��վ\\���ں�ͼƬ\\�Ҿ�װ��\\�Ϻ�˹�������������޹�˾.jpg",
				"F:\\self\\��ҵ\\΢Ȧ\\��������\\��վ\\���ں�ͼƬ\\�Ҿ�װ��\\�������ҷ�.jpg",
				"F:\\self\\��ҵ\\΢Ȧ\\��������\\��վ\\���ں�ͼƬ\\�Ҿ�װ��\\���ִ���.jpg",
				"F:\\self\\��ҵ\\΢Ȧ\\��������\\��վ\\���ں�ͼƬ\\�Ҿ�װ��\\��ӿռ����.jpg",
				"F:\\self\\��ҵ\\΢Ȧ\\��������\\��վ\\���ں�ͼƬ\\�Ҿ�װ��\\�̽��Ҿ�.jpg",
				"F:\\self\\��ҵ\\΢Ȧ\\��������\\��վ\\���ں�ͼƬ\\�Ҿ�װ��\\���ָ��.jpg",
				"F:\\self\\��ҵ\\΢Ȧ\\��������\\��վ\\���ں�ͼƬ\\�Ҿ�װ��\\�������.jpg",
				"F:\\self\\��ҵ\\΢Ȧ\\��������\\��վ\\���ں�ͼƬ\\��ũó��\\AOTO��ͼ.jpg",
				"F:\\self\\��ҵ\\΢Ȧ\\��������\\��վ\\���ں�ͼƬ\\��ũó��\\PowerLink�������.png",
				"F:\\self\\��ҵ\\΢Ȧ\\��������\\��վ\\���ں�ͼƬ\\��ũó��\\�Ϻ���ƽ��ƽ����������޹�˾.jpg",
				"F:\\self\\��ҵ\\΢Ȧ\\��������\\��վ\\���ں�ͼƬ\\��ũó��\\�Ϻ�˳ة�����豸���޹�˾.jpg",
				"F:\\self\\��ҵ\\΢Ȧ\\��������\\��վ\\���ں�ͼƬ\\��ũó��\\������᯸�Ĥ�Ϲ�.jpg",
				"F:\\self\\��ҵ\\΢Ȧ\\��������\\��վ\\���ں�ͼƬ\\��ũó��\\�����л�ũ��.jpg",
				"F:\\self\\��ҵ\\΢Ȧ\\��������\\��վ\\���ں�ͼƬ\\��ũó��\\��������.jpg",
				"F:\\self\\��ҵ\\΢Ȧ\\��������\\��վ\\���ں�ͼƬ\\���ز�\\daxueli.jpg",
				"F:\\self\\��ҵ\\΢Ȧ\\��������\\��վ\\���ں�ͼƬ\\���ز�\\eͨ��������԰��.jpg",
				"F:\\self\\��ҵ\\΢Ȧ\\��������\\��վ\\���ں�ͼƬ\\���ز�\\������̩��������.jpg",
				"F:\\self\\��ҵ\\΢Ȧ\\��������\\��վ\\���ں�ͼƬ\\���ز�\\�����?�ɽ�.jpg",
				"F:\\self\\��ҵ\\΢Ȧ\\��������\\��վ\\���ں�ͼƬ\\���ز�\\�̳���������.jpg",
				"F:\\self\\��ҵ\\΢Ȧ\\��������\\��վ\\���ں�ͼƬ\\���ز�\\��̩��������.jpg",
				"F:\\self\\��ҵ\\΢Ȧ\\��������\\��վ\\���ں�ͼƬ\\�Ļ�����\\����Ļ�.jpg",
				"F:\\self\\��ҵ\\΢Ȧ\\��������\\��վ\\���ں�ͼƬ\\���ξƵ�\\������������.jpg",
				"F:\\self\\��ҵ\\΢Ȧ\\��������\\��վ\\���ں�ͼƬ\\��װ����\\12GLAMOUREVIL.jpg",
				"F:\\self\\��ҵ\\΢Ȧ\\��������\\��վ\\���ں�ͼƬ\\��װ����\\3ZU��װ��.jpg",
				"F:\\self\\��ҵ\\΢Ȧ\\��������\\��վ\\���ں�ͼƬ\\��װ����\\HappyTee.jpg",
				"F:\\self\\��ҵ\\΢Ȧ\\��������\\��վ\\���ں�ͼƬ\\��װ����\\NewBalance.jpg",
				"F:\\self\\��ҵ\\΢Ȧ\\��������\\��վ\\���ں�ͼƬ\\��װ����\\����shanghai.jpg",
				"F:\\self\\��ҵ\\΢Ȧ\\��������\\��վ\\���ں�ͼƬ\\��װ����\\�ӹ����۾�.jpg",
				"F:\\self\\��ҵ\\΢Ȧ\\��������\\��վ\\���ں�ͼƬ\\����������\\��ũ.jpg",
				"F:\\self\\��ҵ\\΢Ȧ\\��������\\��վ\\���ں�ͼƬ\\����������\\����԰��.jpg",
				"F:\\self\\��ҵ\\΢Ȧ\\��������\\��վ\\���ں�ͼƬ\\���������\\DCHdigi�������.jpg",
				"F:\\self\\��ҵ\\΢Ȧ\\��������\\��վ\\���ں�ͼƬ\\���������\\RootSense��Ԫ.jpg",
				"F:\\self\\��ҵ\\΢Ȧ\\��������\\��վ\\���ں�ͼƬ\\���������\\Soumatrix��װ��������.jpg",
				"F:\\self\\��ҵ\\΢Ȧ\\��������\\��վ\\���ں�ͼƬ\\���������\\����Onkyo.jpg",
				"F:\\self\\��ҵ\\΢Ȧ\\��������\\��վ\\���ں�ͼƬ\\���������\\Ӱ����ʦ.jpg",
				"F:\\self\\��ҵ\\΢Ȧ\\��������\\��վ\\���ں�ͼƬ\\���������\\���µ�������.jpg",
				"F:\\self\\��ҵ\\΢Ȧ\\��������\\��վ\\���ں�ͼƬ\\���������\\ˮ����.jpg",
				"F:\\self\\��ҵ\\΢Ȧ\\��������\\��վ\\���ں�ͼƬ\\���������\\��ܿ���Դ��ů.jpg",
				"F:\\self\\��ҵ\\΢Ȧ\\��������\\��վ\\���ں�ͼƬ\\��������\\����ʢ��_����ƽ̨.jpg",
				"F:\\self\\��ҵ\\΢Ȧ\\��������\\��վ\\���ں�ͼƬ\\��������\\�Ϻ�������ó���޹�˾.jpg",
				"F:\\self\\��ҵ\\΢Ȧ\\��������\\��վ\\���ں�ͼƬ\\��������\\����԰��.jpg",
				"F:\\self\\��ҵ\\΢Ȧ\\��������\\��վ\\���ں�ͼƬ\\��������\\�ֳ��Ҿ�Lovhome.jpg",
				"F:\\self\\��ҵ\\΢Ȧ\\��������\\��վ\\���ں�ͼƬ\\��������\\��һ���������̳�.jpg",
				"F:\\self\\��ҵ\\΢Ȧ\\��������\\��վ\\���ں�ͼƬ\\��������\\ȫ����ë����.jpg",
				"F:\\self\\��ҵ\\΢Ȧ\\��������\\��վ\\���ں�ͼƬ\\��������\\��������_����.jpg",
				"F:\\self\\��ҵ\\΢Ȧ\\��������\\��վ\\���ں�ͼƬ\\��������\\Ҽ�ܹ�԰.jpg",
				"F:\\self\\��ҵ\\΢Ȧ\\��������\\��վ\\���ں�ͼƬ\\��������\\ƽ��������.jpg",
				"F:\\self\\��ҵ\\΢Ȧ\\��������\\��վ\\���ں�ͼƬ\\��������\\΢ƽ̨.jpg",
				"F:\\self\\��ҵ\\΢Ȧ\\��������\\��վ\\���ں�ͼƬ\\��������\\��Դ����R��ר����.jpg",
				"F:\\self\\��ҵ\\΢Ȧ\\��������\\��վ\\���ں�ͼƬ\\��������\\����.jpg",
				"F:\\self\\��ҵ\\΢Ȧ\\��������\\��վ\\���ں�ͼƬ\\��������\\��������.jpg",
				"F:\\self\\��ҵ\\΢Ȧ\\��������\\��վ\\���ں�ͼƬ\\��������\\�׶���.jpg",
				"F:\\self\\��ҵ\\΢Ȧ\\��������\\��վ\\���ں�ͼƬ\\��������\\����羳ͨ.jpg",
				"F:\\self\\��ҵ\\΢Ȧ\\��������\\��վ\\���ں�ͼƬ\\��������\\������.jpg",
				"F:\\self\\��ҵ\\΢Ȧ\\��������\\��վ\\���ں�ͼƬ\\��������\\��������.jpg",
				"F:\\self\\��ҵ\\΢Ȧ\\��������\\��վ\\���ں�ͼƬ\\��������\\����lenovo�����.jpg",
				"F:\\self\\��ҵ\\΢Ȧ\\��������\\��վ\\���ں�ͼƬ\\��������\\��������.jpg",
				"F:\\self\\��ҵ\\΢Ȧ\\��������\\��վ\\���ں�ͼƬ\\��������\\��ķũׯ.jpg",
				"F:\\self\\��ҵ\\΢Ȧ\\��������\\��վ\\���ں�ͼƬ\\��������\\������.jpg",
				"F:\\self\\��ҵ\\΢Ȧ\\��������\\��վ\\���ں�ͼƬ\\��������\\;��TGT.jpg",
				"F:\\self\\��ҵ\\΢Ȧ\\��������\\��վ\\���ں�ͼƬ\\��������\\;�����.jpg",
				"F:\\self\\��ҵ\\΢Ȧ\\��������\\��վ\\���ں�ͼƬ\\��������\\�ڹ���ҵ.jpg",
				"F:\\self\\��ҵ\\΢Ȧ\\��������\\��վ\\���ں�ͼƬ\\��������\\Ԥ������ ����Ұ��.jpg",
				"F:\\self\\��ҵ\\΢Ȧ\\��������\\��վ\\���ں�ͼƬ\\���ݱ���\\xiaomeimeijia.jpg",
				"F:\\self\\��ҵ\\΢Ȧ\\��������\\��վ\\���ں�ͼƬ\\���ݱ���\\��ױ��֮������.jpg",
				"F:\\self\\��ҵ\\΢Ȧ\\��������\\��վ\\���ں�ͼƬ\\ͨѶ������\\�����ֻ����Ϻ���.jpg",
				"F:\\self\\��ҵ\\΢Ȧ\\��������\\��վ\\���ں�ͼƬ\\ͨѶ������\\����ֻ�.jpg",
				"F:\\self\\��ҵ\\΢Ȧ\\��������\\��վ\\���ں�ͼƬ\\���ڷ���\\�Ϻ���������Ͷ��.jpg",
				"F:\\self\\��ҵ\\΢Ȧ\\��������\\��վ\\���ں�ͼƬ\\���ڷ���\\����ͨ��ó.jpg",
				"F:\\self\\��ҵ\\΢Ȧ\\��������\\��վ\\���ں�ͼƬ\\���ڷ���\\̫ƽ�ʲ�.png",
				"F:\\self\\��ҵ\\΢Ȧ\\��������\\��վ\\���ں�ͼƬ\\���ڷ���\\�������ʱ�.jpg",
				"F:\\self\\��ҵ\\΢Ȧ\\��������\\��վ\\���ں�ͼƬ\\ʳ������\\7�Ź�·�ƽ�.jpg",
				"F:\\self\\��ҵ\\΢Ȧ\\��������\\��վ\\���ں�ͼƬ\\ʳ������\\Jam's Store.jpg",
				"F:\\self\\��ҵ\\΢Ȧ\\��������\\��վ\\���ں�ͼƬ\\ʳ������\\�Ϻ����Ź���ó�����޹�˾.jpg",
				"F:\\self\\��ҵ\\΢Ȧ\\��������\\��վ\\���ں�ͼƬ\\ʳ������\\�����콢��.jpg",
				"F:\\self\\��ҵ\\΢Ȧ\\��������\\��վ\\���ں�ͼƬ\\ʳ������\\��ɭ��¬������.jpg",
				"F:\\self\\��ҵ\\΢Ȧ\\��������\\��վ\\���ں�ͼƬ\\ʳ������\\����ʳƷ.jpg",
				"F:\\self\\��ҵ\\΢Ȧ\\��������\\��վ\\���ں�ͼƬ\\������ʳ\\ԭʼ�տ�.jpg",
				"F:\\self\\��ҵ\\΢Ȧ\\��������\\��վ\\���ں�ͼƬ\\������ʳ\\���үү.jpg",
				"F:\\self\\��ҵ\\΢Ȧ\\��������\\��վ\\���ں�ͼƬ\\������ʳ\\��ȸ����.jpg",
				"F:\\self\\��ҵ\\΢Ȧ\\��������\\��վ\\���ں�ͼƬ\\������ʳ\\��Т��.png",
				"F:\\self\\��ҵ\\΢Ȧ\\��������\\��վ\\���ں�ͼƬ2\\Ʒ�ƹ��ں�\\�й�����Ȧ.jpg",
				"F:\\self\\��ҵ\\΢Ȧ\\��������\\��վ\\���ں�ͼƬ2\\Ʒ�ƹ��ں�\\Ʒ���й�.jpg",
				"F:\\self\\��ҵ\\΢Ȧ\\��������\\��վ\\���ں�ͼƬ2\\Ʒ�ƹ��ں�\\�ǰͿ�.jpg",
				"F:\\self\\��ҵ\\΢Ȧ\\��������\\��վ\\���ں�ͼƬ2\\Ʒ�ƹ��ں�\\����֮��.jpg",
				"F:\\self\\��ҵ\\΢Ȧ\\��������\\��վ\\���ں�ͼƬ2\\Ʒ�ƹ��ں�\\ţ��֮ѡ.jpg",
				"F:\\self\\��ҵ\\΢Ȧ\\��������\\��վ\\���ں�ͼƬ2\\Ӱ�����ں�\\�Ƶ㲥.jpg",
				"F:\\self\\��ҵ\\΢Ȧ\\��������\\��վ\\���ں�ͼƬ2\\Ӱ�����ں�\\��̸.jpg",
				"F:\\self\\��ҵ\\΢Ȧ\\��������\\��վ\\���ں�ͼƬ2\\Ӱ�����ں�\\�ٶȵ�Ӱ.jpg",
				"F:\\self\\��ҵ\\΢Ȧ\\��������\\��վ\\���ں�ͼƬ2\\Ӱ�����ں�\\��Ʒ��Ӱ.jpg",
				"F:\\self\\��ҵ\\΢Ȧ\\��������\\��վ\\���ں�ͼƬ2\\Ӱ�����ں�\\�����Ӱ־.jpg",
				"F:\\self\\��ҵ\\΢Ȧ\\��������\\��վ\\���ں�ͼƬ2\\�������ں�\\ר������.jpg",
				"F:\\self\\��ҵ\\΢Ȧ\\��������\\��վ\\���ں�ͼƬ2\\�������ں�\\�������.jpg",
				"F:\\self\\��ҵ\\΢Ȧ\\��������\\��վ\\���ں�ͼƬ2\\�������ں�\\�ײ�Ӣ��.jpg",
				"F:\\self\\��ҵ\\΢Ȧ\\��������\\��վ\\���ں�ͼƬ2\\�������ں�\\����Ӣ��������.jpg",
				"F:\\self\\��ҵ\\΢Ȧ\\��������\\��վ\\���ں�ͼƬ2\\�������ں�\\�߶������.jpg",
				"F:\\self\\��ҵ\\΢Ȧ\\��������\\��վ\\���ں�ͼƬ2\\ʱ�й��ں�\\ٻ������.jpg",
				"F:\\self\\��ҵ\\΢Ȧ\\��������\\��վ\\���ں�ͼƬ2\\ʱ�й��ں�\\΢����.jpg",
				"F:\\self\\��ҵ\\΢Ȧ\\��������\\��վ\\���ں�ͼƬ2\\ʱ�й��ں�\\������ǰ��.jpg",
				"F:\\self\\��ҵ\\΢Ȧ\\��������\\��վ\\���ں�ͼƬ2\\ʱ�й��ں�\\��ʿ��װ����.jpg",
				"F:\\self\\��ҵ\\΢Ȧ\\��������\\��վ\\���ں�ͼƬ2\\ʱ�й��ں�\\������.jpg",
				"F:\\self\\��ҵ\\΢Ȧ\\��������\\��վ\\���ں�ͼƬ2\\����ں�\\�Ժ�����.jpg",
				"F:\\self\\��ҵ\\΢Ȧ\\��������\\��վ\\���ں�ͼƬ2\\����ں�\\��ʳ����.jpg",
				"F:\\self\\��ҵ\\΢Ȧ\\��������\\��վ\\���ں�ͼƬ2\\����ں�\\��ʵס��.jpg",
				"F:\\self\\��ҵ\\΢Ȧ\\��������\\��վ\\���ں�ͼƬ2\\����ں�\\��������.jpg",
				"F:\\self\\��ҵ\\΢Ȧ\\��������\\��վ\\���ں�ͼƬ2\\����ں�\\������.jpg",
				"F:\\self\\��ҵ\\΢Ȧ\\��������\\��վ\\���ں�ͼƬ2\\��Ů���ں�\\У����.jpg",
				"F:\\self\\��ҵ\\΢Ȧ\\��������\\��վ\\���ں�ͼƬ2\\��Ů���ں�\\���ѵ��Ӫ.jpg",
				"F:\\self\\��ҵ\\΢Ȧ\\��������\\��վ\\���ں�ͼƬ2\\��Ů���ں�\\�������Ʒ.jpg",
				"F:\\self\\��ҵ\\΢Ȧ\\��������\\��վ\\���ں�ͼƬ2\\��Ů���ں�\\��������.jpg",
				"F:\\self\\��ҵ\\΢Ȧ\\��������\\��վ\\���ں�ͼƬ2\\��Ů���ں�\\������.jpg"
		};
		for(String sourceFile : source){
			
		}
		

	}

}