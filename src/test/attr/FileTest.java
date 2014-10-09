package test.attr;

import java.io.File;
import java.util.HashMap;
import java.util.Map;

public class FileTest {
	static Map<String, String> bt = new HashMap<String, String>(){
		{
			this.put("GTÈü³µ.jpg",	"263");
			this.put("±±Æ¯.jpg",	"267");
		}
	};
	public static int x = 0;
	public static void main(String[] args) {
		String bathFile = "E:\\workspace\\workspace_BEA_XFUNDS\\WMZ_WEIQUAN_A\\WebRoot\\images\\internal\\group\\show";
		File file = new File(bathFile);
//		System.out.println(file.getParent());
//		System.out.println(file.getName().substring(file.getName().indexOf(".")));
//		System.out.println(file.getParent()+"\\"+bt.get(file.getName())+file.getName().substring(file.getName().indexOf(".")));
		printFile(file);
		for(Map.Entry<String, String> en : bt.entrySet()){
			System.out.println("update weiquan_group_image set fileName = '"+
					en.getValue()+en.getKey().substring(en.getKey().indexOf("."))+"' where IMAGEID="+en.getValue()+";");
		}
	}
	
	public static  void printFile(File file){
		if(file.isDirectory()){
	/*	System.out.println("insert into weiquan_SysAttribute(groupId, attrName, attrValue, language, indexNo, attrValueType, level) values("+
					"2, '"+file.getName()+"', "+(x++)+",1,"+x+",1"+",1);");*/
			for(File kid : file.listFiles()){
				printFile(kid);
			}
		}else{
			/*System.out.println("insert into weiquan_bussiness_image(directory, fileName, industryId, imageSource,relationNo,imageType) " +
					"values('/images/internal/bussiness/td_code','"+file.getName() +
			"', 0,'weiquan_bussiness_image', (select bussinessId from weiquan_bussiness where name='"+file.getName().replace(".jpg", "").replace(".jpeg", "").replace(".png", "")+"'), 2);");
*/		
			if(bt.get(file.getName()) != null){
				file.renameTo(new File(file.getParent()+"\\"+bt.get(file.getName())+file.getName().substring(file.getName().indexOf("."))
						
						));
			}
		}
	}
	
}
