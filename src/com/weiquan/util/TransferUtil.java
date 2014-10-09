package com.weiquan.util;

public class TransferUtil {

		// 将字母转换成数字
		public static int letterToNum(String input) {
			return input.getBytes()[0]-96;
		}

		// 将数字转换成字母
		public static String numToLetter(String input) {
			return String.valueOf((char) (input.getBytes()[0] + 48));
		}

		public static void main(String[] args) {
			String i1 = "z";
			String i2 = "123456";
			System.out.println(letterToNum(i1));
			System.out.println(numToLetter(i2));
		}

}
