import 'package:flutter/material.dart';

class SignUpPage extends StatefulWidget {
  const SignUpPage({super.key});

  @override
  State<SignUpPage> createState() => _SignUpPageState();
}

class _SignUpPageState extends State<SignUpPage> {
  final _formKey = GlobalKey<FormState>();
  final TextEditingController _nameController = TextEditingController();
  final TextEditingController _emailController = TextEditingController();
  final TextEditingController _passwordController = TextEditingController();
  final TextEditingController _phoneController = TextEditingController();
  final TextEditingController _chifaCardController = TextEditingController();
  final TextEditingController _dateOfBirthController = TextEditingController();
  String? _selectedSmartphoneSkillLevel;

  // List of possible smartphone skill levels
  final List<String> _smartphoneSkillLevels = [
    'Beginner',
    'Intermediate',
    'Advanced',
  ];

  Future<void> _selectDate(BuildContext context) async {
    final DateTime? picked = await showDatePicker(
      context: context,
      initialDate: DateTime.now(),
      firstDate: DateTime(1900),
      lastDate: DateTime.now(),
    );
    if (picked != null) {
      setState(() {
        _dateOfBirthController.text = "${picked.toLocal()}".split(' ')[0];
      });
    }
  }

  void _signUp() {
    if (_formKey.currentState!.validate()) {
      // Process data
      print('Name: ${_nameController.text}');
      print('Email: ${_emailController.text}');
      print('Password: ${_passwordController.text}');
      print('Phone: ${_phoneController.text}');
      print('Chifa Card: ${_chifaCardController.text}');
      print('Date of Birth: ${_dateOfBirthController.text}');
      print('Smartphone Skill Level: $_selectedSmartphoneSkillLevel');

      // Here you would typically send this data to your backend
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Processing Data')),
      );
    }
  }

  @override
  void dispose() {
    _nameController.dispose();
    _emailController.dispose();
    _passwordController.dispose();
    _phoneController.dispose();
    _chifaCardController.dispose();
    _dateOfBirthController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Sign Up'),
      ),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Form(
          key: _formKey,
          child: ListView(
            children: <Widget>[
              TextFormField(
                controller: _nameController,
                decoration: const InputDecoration(
                  labelText: 'Name',
                  border: OutlineInputBorder(),
                ),
                validator: (value) {
                  if (value == null || value.isEmpty) {
                    return 'Please enter your name';
                  }
                  return null;
                },
              ),
              const SizedBox(height: 16.0),
              TextFormField(
                controller: _emailController,
                decoration: const InputDecoration(
                  labelText: 'Email',
                  border: OutlineInputBorder(),
                ),
                keyboardType: TextInputType.emailAddress,
                validator: (value) {
                  if (value == null || value.isEmpty) {
                    return 'Please enter your email';
                  }
                  if (!RegExp(r'^[^@]+@[^@]+\.[^@]+').hasMatch(value)) {
                    return 'Please enter a valid email address';
                  }
                  return null;
                },
              ),
              const SizedBox(height: 16.0),
              TextFormField(
                controller: _passwordController,
                decoration: const InputDecoration(
                  labelText: 'Password',
                  border: OutlineInputBorder(),
                ),
                obscureText: true,
                validator: (value) {
                  if (value == null || value.isEmpty) {
                    return 'Please enter a password';
                  }
                  if (value.length < 6) {
                    return 'Password must be at least 6 characters long';
                  }
                  return null;
                },
              ),
              const SizedBox(height: 16.0),
              TextFormField(
                controller: _phoneController,
                decoration: const InputDecoration(
                  labelText: 'Phone Number',
                  border: OutlineInputBorder(),
                ),
                keyboardType: TextInputType.phone,
                validator: (value) {
                  if (value == null || value.isEmpty) {
                    return 'Please enter your phone number';
                  }
                  return null;
                },
              ),
              const SizedBox(height: 16.0),
              TextFormField(
                controller: _chifaCardController,
                decoration: const InputDecoration(
                  labelText: 'Chifa Card Registration Number',
                  border: OutlineInputBorder(),
                ),
                keyboardType: TextInputType.number,
                validator: (value) {
                  if (value == null || value.isEmpty) {
                    return 'Please enter your Chifa Card number';
                  }
                  return null;
                },
              ),
              const SizedBox(height: 16.0),
              TextFormField(
                controller: _dateOfBirthController,
                decoration: const InputDecoration(
                  labelText: 'Date of Birth',
                  border: OutlineInputBorder(),
                  suffixIcon: Icon(Icons.calendar_today),
                ),
                readOnly: true,
                onTap: () => _selectDate(context),
                validator: (value) {
                  if (value == null || value.isEmpty) {
                    return 'Please select your date of birth';
                  }
                  return null;
                },
              ),
              const SizedBox(height: 16.0),
              DropdownButtonFormField<String>(
                value: _selectedSmartphoneSkillLevel,
                decoration: const InputDecoration(
                  labelText: 'Smartphone Skill Level',
                  border: OutlineInputBorder(),
                ),
                hint: const Text('Select Skill Level'),
                items: _smartphoneSkillLevels.map((String level) {
                  return DropdownMenuItem<String>(
                    value: level,
                    child: Text(level),
                  );
                }).toList(),
                onChanged: (String? newValue) {
                  setState(() {
                    _selectedSmartphoneSkillLevel = newValue;
                  });
                },
                validator: (value) {
                  if (value == null || value.isEmpty) {
                    return 'Please select your smartphone skill level';
                  }
                  return null;
                },
              ),
              const SizedBox(height: 24.0),
              ElevatedButton(
                onPressed: _signUp,
                style: ElevatedButton.styleFrom(
                  padding: const EdgeInsets.symmetric(vertical: 16.0),
                ),
                child: const Text(
                  'Sign Up',
                  style: TextStyle(fontSize: 18.0),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}