package test.ann;

import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;
import java.nio.charset.Charset;
import java.util.Arrays;

public class Ts {

	/**
	 * @param args
	 * @throws UnsupportedEncodingException 
	 */
	public static void main(String[] args) throws UnsupportedEncodingException {
		String asd="你好你好";
		
			System.out.println(URLEncoder.encode("G家酒吧.jpg"));
			System.out.println(asd.getBytes("UTF-8").length);
			System.out.println(asd.getBytes("GBK").length);
			
			System.out.println(new String(Arrays.copyOfRange("你好你好你好你好你好你好".getBytes("UTF-8"),0 ,27),Charset.forName("UTF-8")));
	}

}
